import React, { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Rect, Circle, Line, Image as KonvaImage, Transformer, Text, Group } from 'react-konva';
import './ImageCanvas.css';

const ImageCanvas = ({ imageUrl, assetId, annotations, onAddAnnotation, onUpdateAnnotation, onDeleteAnnotation }) => {
    const [image, setImage] = useState(null);
    const [tool, setTool] = useState('select');
    const [isDrawing, setIsDrawing] = useState(false);
    const [currentShape, setCurrentShape] = useState(null);
    const [selectedId, setSelectedId] = useState(null);
    const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });

    const stageRef = useRef(null);
    const layerRef = useRef(null);
    const transformerRef = useRef(null);

    // Load image
    useEffect(() => {
        if (!imageUrl) return;

        const img = new window.Image();
        img.crossOrigin = 'Anonymous';
        img.onload = () => {
            setImage(img);
            const maxWidth = 800;
            const maxHeight = 600;
            const ratio = Math.min(maxWidth / img.width, maxHeight / img.height);
            setCanvasSize({
                width: img.width * ratio,
                height: img.height * ratio
            });
        };
        img.onerror = (e) => {
            console.error('Failed to load image:', imageUrl, e);
        };
        img.src = imageUrl;
    }, [imageUrl]);

    // Update transformer when selection changes
    useEffect(() => {
        if (selectedId && transformerRef.current && layerRef.current) {
            const selectedNode = layerRef.current.findOne(`#${selectedId} `);
            if (selectedNode) {
                transformerRef.current.nodes([selectedNode]);
                transformerRef.current.getLayer().batchDraw();
            }
        } else if (transformerRef.current) {
            transformerRef.current.nodes([]);
            transformerRef.current.getLayer().batchDraw();
        }
    }, [selectedId]);

    const handleMouseDown = (e) => {
        // If in select mode, handle selection/deselection
        if (tool === 'select') {
            // Deselect if clicking on empty area (stage or image)
            const clickedOnEmpty = e.target === e.target.getStage() || e.target.getClassName() === 'Image';
            if (clickedOnEmpty) {
                setSelectedId(null);
            }
            return;
        }

        // For drawing tools, start drawing
        const stage = e.target.getStage();
        const pointerPosition = stage.getPointerPosition();

        setIsDrawing(true);

        const newShape = {
            id: `temp - ${Date.now()} `,
            x: pointerPosition.x,
            y: pointerPosition.y,
            label: '',
            tool: tool
        };

        if (tool === 'rectangle') {
            newShape.width = 0;
            newShape.height = 0;
        } else if (tool === 'circle') {
            newShape.radius = 0;
        } else if (tool === 'pen') {
            newShape.points = [pointerPosition.x, pointerPosition.y];
        }

        setCurrentShape(newShape);
    };

    const handleMouseMove = (e) => {
        if (!isDrawing || !currentShape) return;

        const stage = e.target.getStage();
        const pointerPosition = stage.getPointerPosition();

        if (tool === 'rectangle') {
            setCurrentShape({
                ...currentShape,
                width: pointerPosition.x - currentShape.x,
                height: pointerPosition.y - currentShape.y
            });
        } else if (tool === 'circle') {
            const dx = pointerPosition.x - currentShape.x;
            const dy = pointerPosition.y - currentShape.y;
            const radius = Math.sqrt(dx * dx + dy * dy);
            setCurrentShape({
                ...currentShape,
                radius: radius
            });
        } else if (tool === 'pen') {
            setCurrentShape({
                ...currentShape,
                points: [...currentShape.points, pointerPosition.x, pointerPosition.y]
            });
        }
    };

    const handleMouseUp = async () => {
        if (!isDrawing || !currentShape) return;

        setIsDrawing(false);

        // Validate minimum size
        if (tool === 'rectangle' && (Math.abs(currentShape.width) < 5 || Math.abs(currentShape.height) < 5)) {
            setCurrentShape(null);
            return;
        }
        if (tool === 'circle' && currentShape.radius < 5) {
            setCurrentShape(null);
            return;
        }

        // Normalize rectangle coordinates if drawn backwards
        let finalShape = { ...currentShape };
        if (tool === 'rectangle') {
            if (finalShape.width < 0) {
                finalShape.x += finalShape.width;
                finalShape.width = Math.abs(finalShape.width);
            }
            if (finalShape.height < 0) {
                finalShape.y += finalShape.height;
                finalShape.height = Math.abs(finalShape.height);
            }
        }

        // Save annotation with shape data
        let annotationType = 'bounding_box'; // Default for rectangle
        if (tool === 'circle') {
            annotationType = 'bounding_box'; // Circles also use bounding_box
        } else if (tool === 'pen') {
            annotationType = 'polygon';
        }

        const annotationData = {
            asset: assetId,
            type: annotationType,
            label: tool.charAt(0).toUpperCase() + tool.slice(1),
            geometry: {
                x: finalShape.x,
                y: finalShape.y,
                width: finalShape.width,
                height: finalShape.height
            },
            properties: {
                tool: tool
            }
        };

        console.log('Saving annotation:', annotationData);
        await onAddAnnotation(annotationData);
        setCurrentShape(null);
    };

    const handleShapeClick = (e, shapeId) => {
        if (tool !== 'select') return;
        e.cancelBubble = true;
        setSelectedId(shapeId);
    };

    const handleTransformEnd = (e) => {
        const node = e.target;
        const scaleX = node.scaleX();
        const scaleY = node.scaleY();

        // Reset scale
        node.scaleX(1);
        node.scaleY(1);

        // Find the annotation
        const annotation = annotations.find(ann => ann._id === node.id());
        if (!annotation) return;

        const updatedGeometry = {
            x: node.x(),
            y: node.y(),
            width: Math.max(5, node.width() * scaleX),
            height: Math.max(5, node.height() * scaleY)
        };

        console.log('Updating annotation geometry:', annotation._id, updatedGeometry);
        onUpdateAnnotation(annotation._id, {
            geometry: updatedGeometry
        });
    };

    const handleDragEnd = (e) => {
        const node = e.target;
        const annotation = annotations.find(ann => ann._id === node.id());
        if (!annotation) return;

        const coords = annotation.geometry || annotation.properties?.coordinates || {};

        const updatedGeometry = {
            ...coords,
            x: node.x(),
            y: node.y()
        };

        console.log('Dragging annotation geometry:', annotation._id, updatedGeometry);
        onUpdateAnnotation(annotation._id, {
            geometry: updatedGeometry
        });
    };

    const renderAnnotation = (annotation) => {
        // Check for coordinates in either geometry or properties (for backwards compatibility)
        const coords = annotation.geometry || annotation.properties?.coordinates;
        if (!coords) return null;

        const annotationTool = annotation.properties?.tool || 'rectangle';
        const isSelected = selectedId === annotation._id;
        const isDraggable = tool === 'select';

        if (annotationTool === 'rectangle' || annotation.type === 'bounding_box') {
            return (
                <Group key={annotation._id}>
                    <Rect
                        id={annotation._id}
                        x={coords.x || 0}
                        y={coords.y || 0}
                        width={coords.width || 50}
                        height={coords.height || 50}
                        stroke={isSelected ? '#00ff00' : '#00ff00'}
                        strokeWidth={isSelected ? 3 : 2}
                        fill="rgba(0, 255, 0, 0.1)"
                        draggable={isDraggable}
                        onClick={(e) => handleShapeClick(e, annotation._id)}
                        onDragEnd={handleDragEnd}
                        onTransformEnd={handleTransformEnd}
                        listening={isDraggable}
                    />
                    <Text
                        x={coords.x || 0}
                        y={(coords.y || 0) - 20}
                        text={annotation.label}
                        fontSize={14}
                        fill="#00ff00"
                        fontStyle="bold"
                        listening={false}
                    />
                </Group>
            );
        } else if (annotationTool === 'circle') {
            return (
                <Group key={annotation._id}>
                    <Circle
                        id={annotation._id}
                        x={coords.x || 0}
                        y={coords.y || 0}
                        radius={coords.radius || 25}
                        stroke={isSelected ? '#ff0000' : '#ff0000'}
                        strokeWidth={isSelected ? 3 : 2}
                        fill="rgba(255, 0, 0, 0.1)"
                        draggable={isDraggable}
                        onClick={(e) => handleShapeClick(e, annotation._id)}
                        onDragEnd={handleDragEnd}
                        onTransformEnd={handleTransformEnd}
                        listening={isDraggable}
                    />
                    <Text
                        x={(coords.x || 0) - (coords.radius || 25)}
                        y={(coords.y || 0) - (coords.radius || 25) - 20}
                        text={annotation.label}
                        fontSize={14}
                        fill="#ff0000"
                        fontStyle="bold"
                        listening={false}
                    />
                </Group>
            );
        } else if (annotationTool === 'pen' || annotation.type === 'polygon') {
            return (
                <Line
                    key={annotation._id}
                    id={annotation._id}
                    points={coords.points || []}
                    stroke="#0000ff"
                    strokeWidth={2}
                    tension={0.5}
                    lineCap="round"
                    lineJoin="round"
                    listening={false}
                />
            );
        }
        return null;
    };

    if (!image) {
        return (
            <div className="image-canvas-container">
                <div className="canvas-loading">Loading image...</div>
            </div>
        );
    }

    return (
        <div className="image-canvas-container">
            <div className="canvas-toolbar">
                <button
                    className={`tool - btn ${tool === 'select' ? 'active' : ''} `}
                    onClick={() => setTool('select')}
                    title="Select & Move"
                >
                    ➤
                </button>
                <button
                    className={`tool - btn ${tool === 'rectangle' ? 'active' : ''} `}
                    onClick={() => setTool('rectangle')}
                    title="Rectangle"
                >
                    ▭
                </button>
                <button
                    className={`tool - btn ${tool === 'circle' ? 'active' : ''} `}
                    onClick={() => setTool('circle')}
                    title="Circle"
                >
                    ○
                </button>
                <button
                    className={`tool - btn ${tool === 'pen' ? 'active' : ''} `}
                    onClick={() => setTool('pen')}
                    title="Freehand Pen"
                >
                    ✎
                </button>
                {selectedId && (
                    <button
                        className="tool-btn delete-btn"
                        onClick={() => {
                            onDeleteAnnotation(selectedId);
                            setSelectedId(null);
                        }}
                        title="Delete Selected"
                    >
                        🗑️
                    </button>
                )}
                <div className="tool-info">
                    {annotations.length} annotations
                </div>
            </div>

            <div className="canvas-stage">
                <Stage
                    ref={stageRef}
                    width={canvasSize.width}
                    height={canvasSize.height}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                >
                    <Layer ref={layerRef}>
                        {/* Background image */}
                        <KonvaImage
                            image={image}
                            width={canvasSize.width}
                            height={canvasSize.height}
                            listening={false}
                        />

                        {/* Saved annotations */}
                        {annotations && annotations.map(renderAnnotation)}

                        {/* Current drawing shape */}
                        {currentShape && (
                            <>
                                {currentShape.tool === 'rectangle' && (
                                    <Rect
                                        x={currentShape.x}
                                        y={currentShape.y}
                                        width={currentShape.width}
                                        height={currentShape.height}
                                        stroke="#00ff00"
                                        strokeWidth={2}
                                        fill="rgba(0, 255, 0, 0.1)"
                                        dash={[5, 5]}
                                        listening={false}
                                    />
                                )}
                                {currentShape.tool === 'circle' && (
                                    <Circle
                                        x={currentShape.x}
                                        y={currentShape.y}
                                        radius={currentShape.radius}
                                        stroke="#ff0000"
                                        strokeWidth={2}
                                        fill="rgba(255, 0, 0, 0.1)"
                                        dash={[5, 5]}
                                        listening={false}
                                    />
                                )}
                                {currentShape.tool === 'pen' && (
                                    <Line
                                        points={currentShape.points}
                                        stroke="#0000ff"
                                        strokeWidth={2}
                                        tension={0.5}
                                        lineCap="round"
                                        lineJoin="round"
                                        listening={false}
                                    />
                                )}
                            </>
                        )}

                        {/* Transformer for selected shape */}
                        {tool === 'select' && (
                            <Transformer
                                ref={transformerRef}
                                borderStroke="#00ff00"
                                borderStrokeWidth={2}
                                anchorStroke="#00ff00"
                                anchorFill="#ffffff"
                                anchorSize={8}
                                keepRatio={false}
                            />
                        )}
                    </Layer>
                </Stage>
            </div>
        </div>
    );
};

export default ImageCanvas;
