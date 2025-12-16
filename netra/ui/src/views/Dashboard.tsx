import { useState, useEffect } from 'react';
import { Terminal, Play, Activity, AlertOctagon, CheckCircle, Server, Globe, Cpu, Shield, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import ActivityFeed from '../components/ActivityFeed';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ElementType;
    color: string;
    trend: string;
    delay: number;
}

const StatCard = ({ title, value, icon: Icon, color, trend, delay }: StatCardProps) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: delay }}
        className="bg-white dark:bg-cyber-dark border border-slate-200 dark:border-cyber-border p-5 rounded-xl relative overflow-hidden group hover:border-radium-500/50 transition-all duration-300"
    >
        <div className={`absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity ${color}`}>
            <Icon className="w-16 h-16" />
        </div>
        <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-500 dark:text-slate-400 text-sm font-mono tracking-wider">{title}</h3>
            <Icon className={`w-5 h-5 ${color.replace('bg-', 'text-')}`} />
        </div>
        <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-slate-800 dark:text-white font-display text-glow">{value}</span>
            <span className="text-xs text-radium-400 mb-1 font-mono">{trend}</span>
        </div>
    </motion.div>
);

const Dashboard = () => {
    const [target, setTarget] = useState('');
    const [scanning, setScanning] = useState(false);
    const [logs, setLogs] = useState<string[]>([]);
    const [results, setResults] = useState<any>(null);
    const [options, setOptions] = useState<Record<string, boolean>>({
        Cloud: false,
        IoT: false,
        GraphQL: false,
        AutoExploit: false
    });

    const addLog = (msg: string) => setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev]);

    const toggleOption = (opt: string) => {
        setOptions(prev => ({ ...prev, [opt]: !prev[opt] }));
    };

    const startScan = async () => {
        if (!target) return;
        setScanning(true);
        setResults(null);
        setLogs([]);
        addLog(`INITIALIZING DISTRIBUTED SCAN: ${target}`);

        try {
            // Netra v2 API Call (Ingestion Stream)
            const response = await fetch('/api/scan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ target, options }),
            });

            if (!response.ok) throw new Error('API Handshake Failed');

            addLog('Payload delivered to Ingestion Worker (Redis Stream).');
            addLog('NOTE: View Redis Commander (Port 8081) to watch progress.');

            setTimeout(() => {
                setScanning(false);
                addLog('Scan Dispatched Successfully.');
            }, 1000);

        } catch (e: any) {
            addLog(`CRITICAL FAILURE: ${e.message}`);
            setScanning(false);
        }
    };
    /* ... (rest of component until checkboxes) ... */

    {/* Config (Classifieds) */ }
                        <div className="bg-slate-100 dark:bg-gray-900 p-4 border border-slate-300 dark:border-gray-700 mb-6">
                            <h3 className="font-sans font-bold text-xs uppercase text-slate-500 mb-2 border-b border-slate-300 pb-1">Mission Parameters</h3>
                            <div className="grid grid-cols-2 gap-y-2">
                                {Object.keys(options).map(opt => (
                                    <label key={opt} className="flex items-center space-x-2 cursor-pointer">
                                        <input 
                                            type="checkbox" 
                                            checked={options[opt]}
                                            onChange={() => toggleOption(opt)}
                                            className="form-checkbox text-slate-900 rounded-none w-4 h-4" 
                                        />
                                        <span className="font-serif text-sm text-slate-700 dark:text-slate-300 italic">{opt}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={startScan}
                            disabled={scanning}
                            className={`w-full py-4 border-2 border-slate-900 dark:border-white font-bold font-sans tracking-widest uppercase transition-all hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-black ${scanning ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                        >
                            {scanning ? 'TRANSMITTING...' : 'LAUNCH OPERATION'}
                        </button>
                    </div >

    {/* Activity Ticker (Side) */ }
    < div className = "border-t-2 border-slate-900 pt-4" >
        <ActivityFeed />
                    </div >
                </div >

    {/* Main Column: Results / Visualization (Center Spread) - Spans 8 */ }
    < div className = "lg:col-span-8" >
        <div className="bg-white dark:bg-[#1a1a1a] shadow-2xl p-8 min-h-[600px] border border-slate-200 dark:border-gray-800 paper-texture">
            {/* Center Headline */}
            <div className="text-center mb-8">
                <h2 className="font-serif font-bold text-4xl mb-2 text-slate-900 dark:text-white">Analysis Report</h2>
                <div className="flex justify-center items-center gap-4 text-xs font-sans font-bold text-slate-400 uppercase tracking-widest">
                    <span>Intelligence Division</span>
                    <span>&bull;</span>
                    <span>{new Date().toLocaleDateString()}</span>
                    {results && (
                        <>
                            <span>&bull;</span>
                            <button onClick={exportResults} className="text-red-600 hover:underline flex items-center gap-1">
                                <Download className="w-3 h-3" /> PRINT EXPORT
                            </button>
                        </>
                    )}
                </div>
            </div>

            <div className="columns-1 md:columns-2 gap-8 text-justify">
                {!results ? (
                    <div className="break-inside-avoid flex flex-col items-center justify-center h-64 border-4 border-double border-slate-200 dark:border-gray-800 p-8 text-center text-slate-400 italic font-serif">
                        <Shield className={`w-16 h-16 mb-4 ${scanning ? 'animate-pulse text-slate-800 dark:text-white' : ''}`} />
                        {scanning ? "Receiving transmission from field agents..." : "Awaiting Mission Directives. No intelligence data available."}
                    </div>
                ) : (
                    <>
                        {/* Article 1: Ports */}
                        <div className="break-inside-avoid mb-8">
                            <h3 className="font-sans font-bold text-lg uppercase border-b-2 border-black dark:border-white mb-2 pb-1">Network Surface</h3>
                            <p className="font-serif text-sm mb-2 text-slate-600 dark:text-slate-400">
                                Field scanners have identified {results.PortScanner?.open_ports?.length || 0} open entry points on the target system.
                            </p>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {results.PortScanner?.open_ports?.map((p: number) => (
                                    <span key={p} className="bg-slate-100 dark:bg-gray-800 border border-slate-300 dark:border-gray-600 px-2 py-1 font-mono text-xs font-bold">
                                        :{p}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Article 2: Threats */}
                        <div className="break-inside-avoid mb-8">
                            <h3 className="font-sans font-bold text-lg uppercase border-b-2 border-red-600 text-red-600 mb-2 pb-1">Critical Vulnerabilities</h3>
                            {results.ThreatScanner?.vulnerabilities?.length > 0 ? (
                                <ul className="list-disc pl-4 space-y-2 font-serif text-sm text-slate-700 dark:text-slate-300">
                                    {results.ThreatScanner.vulnerabilities.map((v: any, i: number) => (
                                        <li key={i}>
                                            <strong>{v.type}</strong>: {v.details}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="font-serif italic text-slate-500">No immediate threats detected in this sector.</p>
                            )}
                        </div>

                        {/* Raw Data */}
                        <div className="break-inside-avoid p-4 bg-slate-50 dark:bg-black border border-slate-200 dark:border-gray-800">
                            <h4 className="font-mono text-xs font-bold mb-2">RAW_WIRE_TAP.log</h4>
                            <pre className="font-mono text-[10px] overflow-x-auto text-slate-600 dark:text-gray-400">
                                {JSON.stringify(results, null, 2)}
                            </pre>
                        </div>
                    </>
                )}
            </div>
        </div>
                </div >

            </div >
        </div >
    );
};

export default Dashboard;
