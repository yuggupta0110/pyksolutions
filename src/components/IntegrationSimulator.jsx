import React, { useState, useEffect, useRef } from 'react';

// iFlow nodes definition - expanded horizontally across 1000px
const IFLOW_NODES = {
  sender: { id: 'sender', name: 'Sender System', type: 'HTTPS Client', icon: '👤', x: 20, y: 110, w: 90, h: 48 },
  start: { id: 'start', name: 'Start Message', type: 'Event', icon: '🟢', x: 170, y: 110, w: 90, h: 48 },
  modifier: { id: 'modifier', name: 'Content Modifier', type: 'Set Header', icon: '📝', x: 310, y: 60, w: 100, h: 48 },
  groovy: { id: 'groovy', name: 'Groovy Script', type: 'Map Payload', icon: '⚙️', x: 460, y: 60, w: 100, h: 48 },
  mapping: { id: 'mapping', name: 'Message Mapping', type: 'XML to JSON', icon: '🗺️', x: 610, y: 60, w: 100, h: 48 },
  end: { id: 'end', name: 'End Message', type: 'Event', icon: '🔴', x: 760, y: 110, w: 90, h: 48 },
  receiver: { id: 'receiver', name: 'Receiver System', type: 'SOAP / OData', icon: '🏢', x: 910, y: 110, w: 95, h: 48 }
};

// Properties displayed per node
const NODE_PROPERTIES = {
  sender: {
    title: 'Sender System Configuration',
    tabs: ['General', 'Adapter', 'Security'],
    activeTab: 'Adapter',
    content: {
      General: { Name: 'SuccessFactors / Salesforce', Description: 'Inbound client trigger' },
      Adapter: { Type: 'HTTPS', Address: '/v1/trigger-integration', 'Auth Mode': 'OAuth2 Client Credentials' },
      Security: { 'Client ID': 'sf-client-091', 'Scope': 'read_write', 'Token Endpoint': 'https://pyk-auth.api.sap/oauth/token' }
    }
  },
  start: {
    title: 'Start Message Event',
    tabs: ['General'],
    activeTab: 'General',
    content: {
      General: { Name: 'Start Message', 'Trigger Type': 'Inbound Message Call', 'Event ID': 'StartEvent_1' }
    }
  },
  modifier: {
    title: 'Content Modifier - Set Header',
    tabs: ['General', 'Message Header', 'Exchange Property'],
    activeTab: 'Message Header',
    content: {
      General: { Name: 'Set Relevance Header', Description: 'Add SAP CPI relevancy flag' },
      'Message Header': { Action: 'Create', Name: 'ext__cpit_relevantC4C', Source: 'Constant', Value: 'X' },
      'Exchange Property': { Action: 'Create', Name: 'CamelCharsetName', Source: 'Constant', Value: 'UTF-8' }
    }
  },
  groovy: {
    title: 'Groovy Script - Custom Logic',
    tabs: ['General', 'Processing', 'Script File'],
    activeTab: 'Script File',
    content: {
      General: { Name: 'Execute payload map', 'Script File': 'mergeDetails.groovy' },
      Processing: { Method: 'processData', 'Required SDK': 'SAP CPI API V2' },
      'Script File': {
        Language: 'Groovy',
        Code: `import com.sap.gateway.ip.core.customdev.util.Message
import java.util.HashMap

def Message processData(Message message) {
    // Get payload body
    def body = message.getBody(java.lang.String)
    
    // Set custom relevance flag
    message.setHeader("ext__cpit_relevantC4C", "X")
    return message
}`
      }
    }
  },
  mapping: {
    title: 'Message Mapping - XML/JSON Translation',
    tabs: ['General', 'Mapping Setup'],
    activeTab: 'Mapping Setup',
    content: {
      General: { Name: 'Translate Profiles', Description: 'Source XML to Destination OData JSON' },
      'Mapping Setup': { 'Source Path': 'personalDetails/employee', 'Target Path': 's4:BusinessPartner', 'Fields Mapped': '18 Fields' }
    }
  },
  end: {
    title: 'End Message Event',
    tabs: ['General'],
    activeTab: 'General',
    content: {
      General: { Name: 'End Message', 'Output Status': 'Message Processed', 'Event ID': 'EndEvent_1' }
    }
  },
  receiver: {
    title: 'Receiver System Configuration',
    tabs: ['General', 'Connection', 'Authentication'],
    activeTab: 'Connection',
    content: {
      General: { Name: 'SAP S/4HANA ERP', Description: 'Synchronized backend database' },
      Connection: { Address: 'https://s4-tenant.s4hana.ondemand.com/sap/opu/odata', Adapter: 'OData V2', ContentType: 'application/json' },
      Authentication: { Mode: 'Client Certificate', Alias: 's4_client_cert_keystore', 'SSL handshake': 'TLS 1.3' }
    }
  }
};

const TRACE_STEPS = [
  { nodeId: 'sender', text: 'Inbound pipeline trigger received from Sender system via HTTPS.', type: 'info' },
  { nodeId: 'start', text: 'Message sequence initiated. Payload captured: 12 user records.', type: 'info' },
  { nodeId: 'modifier', text: 'Content Modifier: Created HTTP Header "ext__cpit_relevantC4C" with value "X".', type: 'info' },
  { nodeId: 'groovy', text: 'Groovy: Executed mergeDetails.groovy. Checked relevance and payload headers.', type: 'groovy' },
  { nodeId: 'mapping', text: 'Message Mapping: Mapped XML schema to S/4HANA BusinessPartner structure.', type: 'info' },
  { nodeId: 'end', text: 'Message processing successfully finalized on CPI Hub.', type: 'info' },
  { nodeId: 'receiver', text: 'S/4HANA: Post request processed. BP records created (HTTP 201).', type: 'success' }
];

export default function IntegrationSimulator() {
  const [selectedNode, setSelectedNode] = useState('groovy');
  const [activeTab, setActiveTab] = useState('Script File');
  const [traceState, setTraceState] = useState('idle'); // idle, tracing, completed
  const [activeTraceNode, setActiveTraceNode] = useState(null);
  const [traceLogs, setTraceLogs] = useState([]);
  const [particles, setParticles] = useState([]);
  const [hasAutoStarted, setHasAutoStarted] = useState(false);
  
  const containerRef = useRef(null);
  const consoleRef = useRef(null);

  useEffect(() => {
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [traceLogs]);

  // Adjust active tab when switching nodes
  useEffect(() => {
    if (NODE_PROPERTIES[selectedNode]) {
      const defaultTab = NODE_PROPERTIES[selectedNode].activeTab;
      setActiveTab(defaultTab);
    }
  }, [selectedNode]);

  // IntersectionObserver to auto-start trace when scrolled into view
  useEffect(() => {
    if (hasAutoStarted || traceState !== 'idle') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasAutoStarted(true);
          // Wait 600ms for smooth scroll settling
          setTimeout(() => {
            runTrace();
          }, 600);
        }
      },
      { threshold: 0.15 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, [hasAutoStarted, traceState]);

  // Calculate trace progress percentage
  let progressPercent = 0;
  if (traceState === 'completed') {
    progressPercent = 100;
  } else if (traceState === 'tracing' && activeTraceNode) {
    const activeIndex = TRACE_STEPS.findIndex(s => s.nodeId === activeTraceNode);
    progressPercent = activeIndex >= 0 ? Math.round(((activeIndex + 1) / TRACE_STEPS.length) * 100) : 0;
  }

  // Determine if a connection line index has been reached (active/green)
  const isPathActive = (pathIndex) => {
    if (traceState === 'completed') return true;
    if (traceState === 'idle' || !activeTraceNode) return false;

    const nodeOrder = ['sender', 'start', 'modifier', 'groovy', 'mapping', 'end', 'receiver'];
    const activeIndex = nodeOrder.indexOf(activeTraceNode);
    return activeIndex >= pathIndex;
  };

  // Determine path style class name (inactive, transiting-blue-fast, established-green-slow)
  const getPathClass = (pathIndex) => {
    if (traceState === 'idle' || !activeTraceNode) return 'cpi-path';

    const nodeOrder = ['sender', 'start', 'modifier', 'groovy', 'mapping', 'end', 'receiver'];
    const activeIndex = nodeOrder.indexOf(activeTraceNode);

    if (activeIndex === pathIndex) {
      return 'cpi-path transiting';
    }
    if (traceState === 'completed' || activeIndex > pathIndex) {
      return 'cpi-path established';
    }
    return 'cpi-path';
  };

  const runTrace = () => {
    if (traceState === 'tracing') return;
    
    setTraceState('tracing');
    setTraceLogs([]);
    setParticles([]);
    
    let stepIndex = 0;
    
    const runNextStep = () => {
      if (stepIndex < TRACE_STEPS.length) {
        const currentStep = TRACE_STEPS[stepIndex];
        setActiveTraceNode(currentStep.nodeId);
        setTraceLogs(prev => [...prev, { text: currentStep.text, type: currentStep.type }]);
        setSelectedNode(currentStep.nodeId);
        
        stepIndex++;
        setTimeout(runNextStep, 1000);
      } else {
        setTraceState('completed');
        setActiveTraceNode(null);
        setTraceLogs(prev => [...prev, { text: '✔ Pipeline Trace Run Completed. Message Status: COMPLETED.', type: 'success' }]);
        
        // Generate celebration particles around the receiver node
        const newParticles = Array.from({ length: 30 }).map((_, i) => ({
          id: i,
          tx: `${(Math.random() - 0.5) * 160}px`,
          ty: `${(Math.random() - 0.5) * 160 - 40}px`,
          color: ['#10b981', '#0064d2', '#a855f7', '#3b82f6', '#00f2fe'][Math.floor(Math.random() * 5)],
          delay: `${Math.random() * 0.3}s`
        }));
        setParticles(newParticles);
      }
    };
    
    runNextStep();
  };

  const resetTrace = () => {
    setTraceState('idle');
    setActiveTraceNode(null);
    setTraceLogs([]);
    setParticles([]);
    setSelectedNode('groovy');
  };

  const currentProps = NODE_PROPERTIES[selectedNode];

  return (
    <div className="double-bezel-wrapper" id="simulator" ref={containerRef}>
      <div className="double-bezel-inner" style={{ padding: '32px 24px' }}>
        <div style={{ textAlign: 'left', marginBottom: '24px' }}>
          <span className="eyebrow" style={{ marginBottom: '12px' }}>
            iFlow Simulator
          </span>
          <h3 style={{ fontSize: '24px', marginBottom: '8px' }}>Interactive iFlow Simulator</h3>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
            Experience an authentic SAP CPI iFlow Editor. Scroll to this section to automatically trace message packets, watch nodes process headers/scripts, and sync data in real time. Click any block to inspect details.
          </p>
        </div>

        {/* CPI Workspace Editor Mockup */}
        <div className="cpi-editor">
          {/* Top toolbar */}
          <div className="cpi-topbar">
            <div className="cpi-topbar-title">
              <span style={{ fontSize: '14px' }}>📋</span>
              <span>iFlow: Sync_Customer_Profiles_To_S4Hana</span>
              <span style={{ 
                fontSize: '9px', 
                background: 'rgba(255,255,255,0.12)', 
                padding: '2px 8px', 
                borderRadius: '9999px',
                color: '#a5b4fc',
                fontWeight: 600,
                border: '1px solid rgba(255,255,255,0.05)'
              }}>Active</span>
            </div>
            <div className="cpi-topbar-actions">
              {traceState === 'idle' && (
                <button className="cpi-btn-sm primary-action" onClick={runTrace}>
                  Run Trace
                </button>
              )}
              {traceState === 'completed' && (
                <button className="cpi-btn-sm" onClick={resetTrace}>
                  Reset Trace
                </button>
              )}
              {traceState === 'tracing' && (
                <button className="cpi-btn-sm" disabled>
                  Tracing...
                </button>
              )}
            </div>
          </div>

          {/* Canvas and Properties stacked layout */}
          <div className="cpi-workspace">
            
            {/* Top Workspace: iFlow Canvas (Scrollable) */}
            <div className="cpi-canvas-pane">
              
              {/* Canvas Progress Bar */}
              <div className="cpi-progress-bar-container">
                <div className="cpi-progress-bar" style={{ width: `${progressPercent}%` }}></div>
              </div>
              
              {/* Scrollable inner wrapper for canvas */}
              <div className="cpi-canvas-inner">
                {/* iFlow Subprocess Enclosure */}
                <div className="cpi-flow-subprocess" style={{ left: '140px', top: '15px', width: '730px', height: '220px' }}>
                  <span className="cpi-subprocess-title">Integration Process</span>
                </div>

                {/* Connecting SVG paths */}
                <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 2 }}>
                  <defs>
                    <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                      <path d="M 0 2 L 8 5 L 0 8 z" fill="rgba(10, 34, 64, 0.25)" />
                    </marker>
                    <marker id="arrow-active" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                      <path d="M 0 2 L 8 5 L 0 8 z" fill="var(--secondary)" />
                    </marker>
                  </defs>

                  {/* Path coordinates & connection lines - using dynamic class names for marching dash animation */}
                  {/* 1. Sender -> Start */}
                  <path 
                    id="path-sender-start"
                    d={`M ${IFLOW_NODES.sender.x + IFLOW_NODES.sender.w} ${IFLOW_NODES.sender.y + 24} L ${IFLOW_NODES.start.x} ${IFLOW_NODES.start.y + 24}`}
                    fill="none"
                    className={getPathClass(1)}
                    markerEnd={isPathActive(1) ? 'url(#arrow-active)' : 'url(#arrow)'} 
                  />

                  {/* 2. Start -> Modifier */}
                  <path 
                    id="path-start-modifier"
                    d={`M ${IFLOW_NODES.start.x + IFLOW_NODES.start.w} ${IFLOW_NODES.start.y + 24} C ${IFLOW_NODES.start.x + IFLOW_NODES.start.w + 30} ${IFLOW_NODES.start.y + 24}, ${IFLOW_NODES.modifier.x - 30} ${IFLOW_NODES.modifier.y + 24}, ${IFLOW_NODES.modifier.x} ${IFLOW_NODES.modifier.y + 24}`}
                    fill="none"
                    className={getPathClass(2)}
                    markerEnd={isPathActive(2) ? 'url(#arrow-active)' : 'url(#arrow)'} 
                  />

                  {/* 3. Modifier -> Groovy */}
                  <path 
                    id="path-modifier-groovy"
                    d={`M ${IFLOW_NODES.modifier.x + IFLOW_NODES.modifier.w} ${IFLOW_NODES.modifier.y + 24} L ${IFLOW_NODES.groovy.x} ${IFLOW_NODES.groovy.y + 24}`}
                    fill="none"
                    className={getPathClass(3)}
                    markerEnd={isPathActive(3) ? 'url(#arrow-active)' : 'url(#arrow)'} 
                  />

                  {/* 4. Groovy -> Mapping */}
                  <path 
                    id="path-groovy-mapping"
                    d={`M ${IFLOW_NODES.groovy.x + IFLOW_NODES.groovy.w} ${IFLOW_NODES.groovy.y + 24} L ${IFLOW_NODES.mapping.x} ${IFLOW_NODES.mapping.y + 24}`}
                    fill="none"
                    className={getPathClass(4)}
                    markerEnd={isPathActive(4) ? 'url(#arrow-active)' : 'url(#arrow)'} 
                  />

                  {/* 5. Mapping -> End */}
                  <path 
                    id="path-mapping-end"
                    d={`M ${IFLOW_NODES.mapping.x + IFLOW_NODES.mapping.w} ${IFLOW_NODES.mapping.y + 24} C ${IFLOW_NODES.mapping.x + IFLOW_NODES.mapping.w + 30} ${IFLOW_NODES.mapping.y + 24}, ${IFLOW_NODES.end.x - 30} ${IFLOW_NODES.end.y + 24}, ${IFLOW_NODES.end.x} ${IFLOW_NODES.end.y + 24}`}
                    fill="none"
                    className={getPathClass(5)}
                    markerEnd={isPathActive(5) ? 'url(#arrow-active)' : 'url(#arrow)'} 
                  />

                  {/* 6. End -> Receiver */}
                  <path 
                    id="path-end-receiver"
                    d={`M ${IFLOW_NODES.end.x + IFLOW_NODES.end.w} ${IFLOW_NODES.end.y + 24} L ${IFLOW_NODES.receiver.x} ${IFLOW_NODES.receiver.y + 24}`}
                    fill="none"
                    className={getPathClass(6)}
                    markerEnd={isPathActive(6) ? 'url(#arrow-active)' : 'url(#arrow)'} 
                  />
                </svg>

                {/* Render Nodes */}
                {Object.keys(IFLOW_NODES).map((key) => {
                  const node = IFLOW_NODES[key];
                  const isSelected = selectedNode === key;
                  const isActiveTrace = activeTraceNode === key;
                  
                  return (
                    <div 
                      key={key}
                      className={`cpi-flow-node ${isSelected ? 'selected' : ''} ${isActiveTrace ? 'active-trace' : ''}`}
                      style={{
                        left: `${node.x}px`,
                        top: `${node.y}px`,
                        width: `${node.w}px`,
                        height: `${node.h}px`
                      }}
                      onClick={() => setSelectedNode(key)}
                    >
                      <span className="cpi-node-icon">{node.icon}</span>
                      <span className="cpi-node-name">{node.name}</span>
                      <span className="cpi-node-type">{node.type}</span>
                    </div>
                  );
                })}

                {/* Confetti Explosion on Receiver Node */}
                {traceState === 'completed' && (
                  <div 
                    className="cpi-celebration-particles" 
                    style={{ 
                      left: `${IFLOW_NODES.receiver.x}px`, 
                      top: `${IFLOW_NODES.receiver.y}px`, 
                      width: `${IFLOW_NODES.receiver.w}px`, 
                      height: `${IFLOW_NODES.receiver.h}px` 
                    }}
                  >
                    {particles.map((p) => (
                      <div 
                        key={p.id}
                        className="confetti-dot" 
                        style={{ 
                          '--tx': p.tx, 
                          '--ty': p.ty, 
                          background: p.color,
                          animationDelay: p.delay,
                          left: '50%',
                          top: '50%'
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Workspace: Properties Panel */}
            <div className="cpi-properties-pane">
              <div className="cpi-properties-header">
                Properties: {currentProps.title}
              </div>
              <div className="cpi-properties-tabs">
                {currentProps.tabs.map((tab) => (
                  <button
                    key={tab}
                    className={`cpi-prop-tab ${activeTab === tab ? 'active' : ''}`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <div className="cpi-properties-content">
                {activeTab === 'Script File' && selectedNode === 'groovy' ? (
                  <pre style={{ 
                    fontFamily: 'var(--font-mono)', 
                    fontSize: '10px', 
                    background: 'rgba(7,9,14,0.6)', 
                    padding: '12px', 
                    borderRadius: '8px', 
                    border: '1px solid rgba(255,255,255,0.06)',
                    maxHeight: '90px', // Adjusted to fit bottom pane height
                    overflowY: 'auto',
                    margin: 0,
                    color: '#c7d2fe',
                    textAlign: 'left'
                  }}>
                    <code>{currentProps.content['Script File'].Code}</code>
                  </pre>
                ) : (
                  <div>
                    {Object.keys(currentProps.content[activeTab] || {}).map((label) => (
                      <div key={label} className="cpi-prop-row">
                        <span className="cpi-prop-label">{label}</span>
                        <span className="cpi-prop-val">{currentProps.content[activeTab][label]}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* Trace logs terminal */}
        {traceLogs.length > 0 && (
          <div style={{ marginTop: '24px', textAlign: 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-secondary)', fontWeight: 600 }}>
                CPI Trace Monitor Log
              </span>
              <span style={{ 
                width: '8px', 
                height: '8px', 
                borderRadius: '50%', 
                background: traceState === 'completed' ? 'var(--secondary)' : 'var(--primary)', 
                animation: traceState === 'tracing' ? 'pulse-dot 1s infinite' : 'none' 
              }}></span>
            </div>
            <div className="sim-console" style={{ height: '110px' }} ref={consoleRef}>
              {traceLogs.map((log, index) => (
                <div 
                  key={index} 
                  className={`sim-console-line ${log.type === 'success' ? 'success' : log.type === 'groovy' ? 'warning' : ''}`} 
                  style={{ color: log.type === 'success' ? '#4ade80' : log.type === 'groovy' ? '#facc15' : '#e2e8f0' }}
                >
                  &gt; {log.text}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
