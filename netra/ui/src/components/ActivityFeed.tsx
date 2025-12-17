import React from 'react';
import { motion } from 'framer-motion';
import { Activity, ShieldCheck, AlertTriangle, User, Database } from 'lucide-react';



const ActivityFeed = () => {
    const [activities, setActivities] = React.useState<any[]>([]);

    React.useEffect(() => {
        // Fetch recent scans to populate activity feed
        fetch('/scans?limit=10')
            .then(res => res.json())
            .then(data => {
                const mapped = data.map((scan: any, i: number) => ({
                    id: scan.id,
                    type: scan.status === 'completed' ? 'scan' : 'vuln', // visual variance
                    msg: `Scan ${scan.status} for ${scan.target}`,
                    time: new Date(scan.timestamp || Date.now()).toLocaleTimeString(),
                    icon: scan.status === 'completed' ? ShieldCheck : Activity,
                    color: scan.status === 'completed' ? 'text-green-400' : 'text-yellow-400'
                }));
                setActivities(mapped);
            })
            .catch(err => console.error("Activity fetch failed", err));
    }, []);

    return (
        <div className="bg-cyber-dark/50 border border-cyber-border rounded-xl p-6 relative backdrop-blur overflow-hidden flex flex-col h-full">
            <h3 className="text-lg font-display font-bold text-white mb-4 border-b border-cyber-border pb-2">Recent Activity</h3>

            <ul className="space-y-4 overflow-y-auto pr-2 scrollbar-thin">
                {activities.length === 0 ? (
                    <li className="text-slate-500 italic text-sm">No recent activity logs.</li>
                ) : activities.map((item, index) => (
                    <motion.li
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex gap-4 items-start group"
                    >
                        <div className={`mt-1 bg-cyber-black p-2 rounded-lg border border-cyber-border group-hover:border-radium-500/30 transition-colors ${item.color}`}>
                            <item.icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm text-slate-300 group-hover:text-white transition-colors">{item.msg}</p>
                            <span className="text-xs text-slate-600 font-mono">{item.time}</span>
                        </div>
                    </motion.li>
                ))}
            </ul>
        </div>
    );
};

export default ActivityFeed;
