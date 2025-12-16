import React from 'react';
import { motion } from 'framer-motion';
import { Server, Globe, Box, MoreVertical, Wifi, Shield } from 'lucide-react';



interface StatusBadgeProps {
    status: string;
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
    const styles = {
        active: 'bg-green-500/10 text-green-400 border-green-500/20',
        inactive: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
        warning: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
        critical: 'bg-red-500/10 text-red-400 border-red-500/20'
    };
    return (
        <span className={`px-2 py-1 rounded text-xs font-mono border ${styles[status as keyof typeof styles] || styles.inactive}`}>
            {status.toUpperCase()}
        </span>
    );
};

const Assets = () => {
    const [assets, setAssets] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        fetch('/api/assets')
            .then(res => res.json())
            .then(data => {
                setAssets(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch assets:", err);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div className="p-8 text-center text-slate-400 font-mono animate-pulse">Scanning Network Topology...</div>;
    }

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white mb-2">Classified Assets</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-serif italic">Inventory of discovered entities from surveillance operations.</p>
                </div>
                <button className="bg-slate-900 dark:bg-white text-white dark:text-black px-4 py-2 text-sm font-bold uppercase tracking-widest hover:opacity-80 transition-all">
                    + Manual Entry
                </button>
            </div>

            <div className="bg-white dark:bg-[#1a1a1a] border-4 border-double border-slate-300 dark:border-gray-700 shadow-xl p-4">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b-2 border-black dark:border-white text-slate-500 dark:text-slate-400 text-xs font-sans font-bold uppercase tracking-widest">
                            <th className="p-4">Entity Name</th>
                            <th className="p-4">Type</th>
                            <th className="p-4">Details</th>
                            <th className="p-4">Status</th>
                            <th className="p-4"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-gray-800">
                        {assets.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="p-8 text-center font-serif italic text-slate-500">No assets discovered in current sector. Run a scan to populate.</td>
                            </tr>
                        ) : assets.map((asset, index) => (
                            <motion.tr
                                key={asset.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="group hover:bg-slate-50 dark:hover:bg-gray-900 transition-colors"
                            >
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 border border-slate-300 dark:border-gray-600 bg-slate-100 dark:bg-black text-slate-700 dark:text-slate-300">
                                            {asset.type === 'Domain' ? <Globe size={16} /> :
                                                asset.type === 'IP Address' ? <Server size={16} /> :
                                                    <Box size={16} />}
                                        </div>
                                        <span className="font-bold font-serif text-lg text-slate-800 dark:text-slate-200 group-hover:underline decoration-red-500 decoration-2 underline-offset-4">{asset.name}</span>
                                    </div>
                                </td>
                                <td className="p-4 font-mono text-sm text-slate-600 dark:text-slate-400 uppercase">{asset.type}</td>
                                <td className="p-4 text-sm font-serif italic text-slate-500">{asset.details}</td>
                                <td className="p-4"><StatusBadge status={asset.status} /></td>
                                <td className="p-4 text-right">
                                    <button className="text-slate-400 hover:text-black dark:hover:text-white transition-colors">
                                        <MoreVertical size={16} />
                                    </button>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Assets;
