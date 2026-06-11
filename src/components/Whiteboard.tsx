import React, { useEffect, useRef, useState } from 'react';
import * as fabric from 'fabric';
import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';
import { io, Socket } from 'socket.io-client';
import './Whiteboard.css';

const Whiteboard: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const socketRef = useRef<Socket | null>(null);
  
  const [color, setColor] = useState('#212529');
  const [brushSize, setBrushSize] = useState(4);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isDrawingMode, setIsDrawingMode] = useState(true);
  
  const sessionId = "default-session-room";
  const userId = useRef<string>(Math.random().toString(36).substring(7));
  const remoteCursors = useRef<{ [key: string]: fabric.Object }>({});

  const historyRef = useRef<string[]>([]);
  const historyIndexRef = useRef<number>(-1);
  const isHistoryModifying = useRef<boolean>(false);
  const isRemoteApplying = useRef<boolean>(false);
  const isUserDrawing = useRef<boolean>(false);

  useEffect(() => {
    socketRef.current = io('http://localhost:3001');
    socketRef.current.emit('join-session', sessionId);

    if (canvasRef.current && containerRef.current && !fabricRef.current) {
      const containerWidth = containerRef.current.clientWidth || window.innerWidth;
      const containerHeight = containerRef.current.clientHeight || window.innerHeight;

      fabricRef.current = new fabric.Canvas(canvasRef.current, {
        isDrawingMode: isDrawingMode,
        width: containerWidth,
        height: containerHeight,
        backgroundColor: '#ffffff'
      });

      const brush = new fabric.PencilBrush(fabricRef.current);
      brush.color = color;
      brush.width = brushSize;
      fabricRef.current.freeDrawingBrush = brush;

      saveHistory();

      fabricRef.current.on('mouse:down', () => {
        isUserDrawing.current = true;
      });

      fabricRef.current.on('mouse:up', () => {
        isUserDrawing.current = false;
      });

      fabricRef.current.on('object:added', (e: any) => {
        if (e.target && (e.target.id === 'remote-cursor' || e.target.id === 'remote-shape')) return;
        if (isHistoryModifying.current || isRemoteApplying.current) return;
        saveHistory();
        
        const payload = JSON.stringify({ type: 'add', obj: e.target.toJSON() });
        socketRef.current?.emit('canvas-update', { sessionId, json: payload });
      });

      fabricRef.current.on('object:modified', (e: any) => {
        if (e.target && e.target.id === 'remote-cursor') return;
        if (isHistoryModifying.current || isRemoteApplying.current) return;
        saveHistory();
        broadcastFullCanvas();
      });

      fabricRef.current.on('object:removed', (e: any) => {
        if (e.target && e.target.id === 'remote-cursor') return;
        if (isHistoryModifying.current || isRemoteApplying.current) return;
        saveHistory();
        broadcastFullCanvas();
      });

      fabricRef.current.on('mouse:move', (options: any) => {
        try {
          const pt = options.scenePoint || options.pointer || options.absolutePointer || options.e;
          if (pt && pt.x !== undefined && pt.y !== undefined) {
            socketRef.current?.emit('cursor-move', {
              sessionId,
              userId: userId.current,
              x: pt.x,
              y: pt.y
            });
          }
        } catch (error) {}
      });
    }

    socketRef.current.on('canvas-update', (payloadString: string) => {
      if (!fabricRef.current || isUserDrawing.current) return;
      
      try {
        const payload = JSON.parse(payloadString);
        isRemoteApplying.current = true;

        if (payload.type === 'add') {
          const enlivenResult = fabric.util.enlivenObjects([payload.obj], (objects: any[]) => {
            if (objects && objects[0]) {
              const newObj = objects[0];
              // @ts-ignore
              newObj.set({ id: 'remote-shape' });
              fabricRef.current?.add(newObj);
              fabricRef.current?.renderAll();
            }
            isRemoteApplying.current = false;
          });
          
          if (enlivenResult && typeof enlivenResult.then === 'function') {
            enlivenResult.then((objects: any[]) => {
              if (objects && objects[0]) {
                const newObj = objects[0];
                // @ts-ignore
                newObj.set({ id: 'remote-shape' });
                fabricRef.current?.add(newObj);
                fabricRef.current?.renderAll();
              }
              isRemoteApplying.current = false;
            }).catch(() => { isRemoteApplying.current = false; });
          }
        } else if (payload.type === 'full') {
          const loadPromise = fabricRef.current.loadFromJSON(payload.state, () => {
            fabricRef.current?.renderAll();
            isRemoteApplying.current = false;
          });
          if (loadPromise && typeof loadPromise.then === 'function') {
            loadPromise.then(() => {
              fabricRef.current?.renderAll();
              isRemoteApplying.current = false;
            }).catch(() => { isRemoteApplying.current = false; });
          }
        } else {
          isRemoteApplying.current = false;
        }
      } catch (e) {
        try {
          const loadPromise = fabricRef.current.loadFromJSON(payloadString, () => {
            fabricRef.current?.renderAll();
            isRemoteApplying.current = false;
          });
          if (loadPromise && typeof loadPromise.then === 'function') {
            loadPromise.then(() => {
              fabricRef.current?.renderAll();
              isRemoteApplying.current = false;
            });
          }
        } catch (err) {
          isRemoteApplying.current = false;
        }
      }
    });

    socketRef.current.on('cursor-move', (data: { userId: string; x: number; y: number }) => {
      if (!fabricRef.current) return;

      if (remoteCursors.current[data.userId]) {
        remoteCursors.current[data.userId].set({ left: data.x, top: data.y });
        // @ts-ignore
        remoteCursors.current[data.userId].bringToFront?.();
        fabricRef.current.renderAll();
      } else {
        const cursorCircle = new fabric.Circle({
          left: data.x,
          top: data.y,
          radius: 5,
          fill: '#ffc107',
          selectable: false,
          evented: false,
          excludeFromExport: true,
          // @ts-ignore
          id: 'remote-cursor'
        });

        remoteCursors.current[data.userId] = cursorCircle;
        fabricRef.current.add(cursorCircle);
        fabricRef.current.renderAll();
      }
    });

    socketRef.current.on('user-disconnected', (disconnectedId: string) => {
      if (remoteCursors.current[disconnectedId] && fabricRef.current) {
        fabricRef.current.remove(remoteCursors.current[disconnectedId]);
        delete remoteCursors.current[disconnectedId];
        fabricRef.current.renderAll();
      }
    });

    const handleResize = () => {
      if (fabricRef.current && containerRef.current) {
        fabricRef.current.setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight
        });
        fabricRef.current.renderAll();
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (fabricRef.current) {
        fabricRef.current.dispose();
        fabricRef.current = null;
      }
      socketRef.current?.disconnect();
    };
  }, []);

  useEffect(() => {
    if (fabricRef.current && fabricRef.current.freeDrawingBrush) {
      fabricRef.current.freeDrawingBrush.color = color;
      fabricRef.current.freeDrawingBrush.width = brushSize;
    }
  }, [color, brushSize]);

  useEffect(() => {
    if (fabricRef.current) {
      fabricRef.current.isDrawingMode = isDrawingMode;
    }
  }, [isDrawingMode]);

  const broadcastFullCanvas = () => {
    if (!fabricRef.current || isRemoteApplying.current) return;
    const payload = JSON.stringify({ type: 'full', state: fabricRef.current.toJSON() });
    socketRef.current?.emit('canvas-update', { sessionId, json: payload });
  };

  const saveHistory = () => {
    if (!fabricRef.current) return;
    const json = JSON.stringify(fabricRef.current.toJSON());
    historyRef.current = historyRef.current.slice(0, historyIndexRef.current + 1);
    historyRef.current.push(json);
    historyIndexRef.current = historyRef.current.length - 1;
  };

  const undo = () => {
    if (historyIndexRef.current > 0 && fabricRef.current) {
      isHistoryModifying.current = true;
      historyIndexRef.current -= 1;
      const json = historyRef.current[historyIndexRef.current];
      fabricRef.current.loadFromJSON(json, () => {
        fabricRef.current?.renderAll();
        broadcastFullCanvas();
        isHistoryModifying.current = false;
      });
    }
  };

  const redo = () => {
    if (historyIndexRef.current < historyRef.current.length - 1 && fabricRef.current) {
      isHistoryModifying.current = true;
      historyIndexRef.current += 1;
      const json = historyRef.current[historyIndexRef.current];
      fabricRef.current.loadFromJSON(json, () => {
        fabricRef.current?.renderAll();
        broadcastFullCanvas();
        isHistoryModifying.current = false;
      });
    }
  };

  const clearBoard = () => {
    if (fabricRef.current) {
      fabricRef.current.clear();
      fabricRef.current.backgroundColor = '#ffffff';
      saveHistory();
      broadcastFullCanvas();
    }
  };

  const exportBoard = () => {
    if (!fabricRef.current) return;
    const dataURL = fabricRef.current.toDataURL({
      format: 'png',
      quality: 1,
      multiplier: 2
    });
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'my-whiteboard.png';
    link.click();
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !fabricRef.current) return;

    setIsAnalyzing(true);
    setIsDrawingMode(false);

    const reader = new FileReader();
    reader.onload = async (f) => {
      const data = f.target?.result as string;
      
      try {
        const imgObj = await fabric.Image.fromURL(data);
        if (imgObj) {
          const img = imgObj as fabric.Image;
          img.scaleToWidth(400);
          img.set({ left: 100, top: 100 });
          fabricRef.current?.add(img);

          const calculatedWidth = (img.width ?? 0) * (img.scaleX ?? 1);
          const calculatedHeight = (img.height ?? 0) * (img.scaleY ?? 1);

          const htmlImg = document.createElement('img');
          htmlImg.src = data;
          htmlImg.width = calculatedWidth;
          htmlImg.height = calculatedHeight;

          await tf.ready();
          const model = await mobilenet.load();
          const predictions = await model.classify(htmlImg as any);

          if (predictions && predictions.length > 0) {
            const bestPrediction = predictions[0];
            const confidenceText = `${bestPrediction.className} (${Math.round(bestPrediction.probability * 100)}%)`;
            
            const text = new fabric.Text(confidenceText, {
              left: 100,
              top: 60,
              fontSize: 20,
              fill: '#ffffff',
              backgroundColor: '#0d6efd',
              padding: 6,
              fontWeight: 'bold'
            });
            
            fabricRef.current?.add(text);
          }
          
          fabricRef.current?.renderAll();
          broadcastFullCanvas();
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsAnalyzing(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="whiteboard-viewport">
      
      <div className="floating-dock">
        <button 
          className={`dock-btn ${isDrawingMode ? 'active' : ''}`}
          onClick={() => setIsDrawingMode(true)}
        >
          ✏️ Draw
        </button>
        <button 
          className={`dock-btn ${!isDrawingMode ? 'active' : ''}`}
          onClick={() => setIsDrawingMode(false)}
        >
          🤚 Pan
        </button>

        <div className="dock-divider"></div>

        <div className="dock-color-wrapper">
          <input
            id="colorPicker"
            type="color"
            className="dock-color-picker"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            disabled={!isDrawingMode}
          />
        </div>
        
        <div className="dock-slider-wrapper">
          <span className="dock-slider-label">{brushSize}px</span>
          <input
            id="brushSize"
            type="range"
            className="form-range dock-slider"
            min="1"
            max="40"
            value={brushSize}
            onChange={(e) => setBrushSize(parseInt(e.target.value, 10))}
            disabled={!isDrawingMode}
          />
        </div>

        <div className="dock-divider"></div>

        <div className="dock-action-group">
          <button className="dock-icon-btn" onClick={undo} title="Undo">↺</button>
          <button className="dock-icon-btn" onClick={redo} title="Redo">↻</button>
          <button className="dock-icon-btn btn-clear" onClick={clearBoard} title="Clear Board">🗑️</button>
        </div>

        <div className="dock-divider"></div>

        <input
          type="file"
          accept="image/*"
          className="d-none"
          ref={fileInputRef}
          onChange={handleImageUpload}
        />
        
        <div className="dock-action-group">
          <button
            className="dock-btn btn-predict"
            onClick={() => fileInputRef.current?.click()}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? (
              <>
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" style={{ width: '12px', height: '12px' }}></span>
                AI...
              </>
            ) : (
              '📷 Predict'
            )}
          </button>

          <button className="dock-btn btn-export" onClick={exportBoard}>
            💾 Export
          </button>
        </div>

      </div>
      
      <div ref={containerRef} className="canvas-container-viewport">
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
};

export default Whiteboard;