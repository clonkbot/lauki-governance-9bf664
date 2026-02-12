import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Proposal {
  id: number;
  title: string;
  description: string;
  author: string;
  authorHoldings: number;
  status: 'active' | 'passed' | 'rejected' | 'pending';
  votesFor: number;
  votesAgainst: number;
  totalVotingPower: number;
  endDate: string;
  category: string;
}

interface Vote {
  proposalId: number;
  support: boolean;
  power: number;
}

const mockProposals: Proposal[] = [
  {
    id: 1,
    title: "LIP-001: Treasury Diversification Strategy",
    description: "Allocate 15% of treasury holdings to yield-bearing stablecoins for protocol sustainability. This proposal aims to reduce volatility exposure while maintaining growth potential.",
    author: "0x7a3b...f92c",
    authorHoldings: 125000,
    status: 'active',
    votesFor: 892450,
    votesAgainst: 234100,
    totalVotingPower: 1500000,
    endDate: "2024-02-15",
    category: "TREASURY"
  },
  {
    id: 2,
    title: "LIP-002: Community Grants Program",
    description: "Establish a 50,000 $LAUKI grants pool for developers building on the ecosystem. Quarterly disbursements with community review.",
    author: "0x4d1e...a8b3",
    authorHoldings: 89000,
    status: 'active',
    votesFor: 654200,
    votesAgainst: 123800,
    totalVotingPower: 1500000,
    endDate: "2024-02-18",
    category: "ECOSYSTEM"
  },
  {
    id: 3,
    title: "LIP-003: Governance Quorum Adjustment",
    description: "Reduce minimum quorum from 10% to 7.5% to improve proposal throughput while maintaining decentralization standards.",
    author: "0x9c2f...d4e1",
    authorHoldings: 210000,
    status: 'pending',
    votesFor: 0,
    votesAgainst: 0,
    totalVotingPower: 1500000,
    endDate: "2024-02-22",
    category: "GOVERNANCE"
  },
  {
    id: 4,
    title: "LIP-004: Multi-chain Expansion",
    description: "Deploy $LAUKI governance contracts to Arbitrum and Base networks for broader accessibility and reduced gas costs.",
    author: "0x2b8a...c7f5",
    authorHoldings: 156000,
    status: 'passed',
    votesFor: 1120000,
    votesAgainst: 180000,
    totalVotingPower: 1500000,
    endDate: "2024-01-28",
    category: "PROTOCOL"
  },
];

const userHoldings = 45000;
const totalSupply = 10000000;

function App() {
  const [proposals, setProposals] = useState<Proposal[]>(mockProposals);
  const [userVotes, setUserVotes] = useState<Vote[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'passed' | 'pending'>('all');
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [showNewProposal, setShowNewProposal] = useState(false);
  const [newProposal, setNewProposal] = useState({ title: '', description: '', category: 'GOVERNANCE' });

  const handleVote = (proposalId: number, support: boolean) => {
    const existingVote = userVotes.find(v => v.proposalId === proposalId);
    if (existingVote) return;

    setUserVotes([...userVotes, { proposalId, support, power: userHoldings }]);
    setProposals(proposals.map(p => {
      if (p.id === proposalId) {
        return {
          ...p,
          votesFor: support ? p.votesFor + userHoldings : p.votesFor,
          votesAgainst: !support ? p.votesAgainst + userHoldings : p.votesAgainst,
        };
      }
      return p;
    }));
  };

  const handleSubmitProposal = () => {
    if (!newProposal.title || !newProposal.description) return;

    const proposal: Proposal = {
      id: proposals.length + 1,
      title: `LIP-00${proposals.length + 1}: ${newProposal.title}`,
      description: newProposal.description,
      author: "0xYOUR...ADDR",
      authorHoldings: userHoldings,
      status: 'pending',
      votesFor: 0,
      votesAgainst: 0,
      totalVotingPower: 1500000,
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      category: newProposal.category,
    };

    setProposals([proposal, ...proposals]);
    setNewProposal({ title: '', description: '', category: 'GOVERNANCE' });
    setShowNewProposal(false);
  };

  const filteredProposals = proposals.filter(p => {
    if (activeTab === 'all') return true;
    return p.status === activeTab;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-lime-400 text-black';
      case 'passed': return 'bg-emerald-500 text-black';
      case 'rejected': return 'bg-red-500 text-white';
      case 'pending': return 'bg-amber-400 text-black';
      default: return 'bg-zinc-600 text-white';
    }
  };

  const votingPower = ((userHoldings / totalSupply) * 100).toFixed(4);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-body relative overflow-x-hidden">
      {/* Noise overlay */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none z-50"
           style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")' }} />

      {/* Grid background */}
      <div className="fixed inset-0 opacity-[0.04] pointer-events-none"
           style={{ backgroundImage: 'linear-gradient(to right, #a3e635 1px, transparent 1px), linear-gradient(to bottom, #a3e635 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

      {/* Header */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="sticky top-0 z-40 border-b-2 border-zinc-800 bg-zinc-950/90 backdrop-blur-sm"
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 md:py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-lime-400 flex items-center justify-center">
                <span className="font-display text-black text-lg md:text-xl font-bold">L</span>
              </div>
              <div>
                <h1 className="font-display text-xl md:text-2xl tracking-tight">$LAUKI</h1>
                <p className="text-[10px] md:text-xs text-zinc-500 font-mono tracking-widest">GOVERNANCE FORUM</p>
              </div>
            </div>

            <div className="flex items-center gap-3 md:gap-6">
              <div className="border-2 border-zinc-800 px-3 md:px-4 py-2 md:py-3 bg-zinc-900">
                <p className="text-[10px] text-zinc-500 font-mono tracking-widest mb-1">YOUR POWER</p>
                <p className="font-display text-lg md:text-xl text-lime-400">{votingPower}%</p>
              </div>
              <div className="border-2 border-zinc-800 px-3 md:px-4 py-2 md:py-3 bg-zinc-900">
                <p className="text-[10px] text-zinc-500 font-mono tracking-widest mb-1">HOLDINGS</p>
                <p className="font-display text-lg md:text-xl">{userHoldings.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-12">
        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8 md:mb-12"
        >
          {[
            { label: 'TOTAL PROPOSALS', value: proposals.length },
            { label: 'ACTIVE VOTES', value: proposals.filter(p => p.status === 'active').length },
            { label: 'PARTICIPATION', value: '67.3%' },
            { label: 'TOTAL SUPPLY', value: '10M' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="border-l-4 border-lime-400 bg-zinc-900/50 pl-3 md:pl-4 py-3 md:py-4"
            >
              <p className="text-[9px] md:text-[10px] text-zinc-500 font-mono tracking-widest">{stat.label}</p>
              <p className="font-display text-xl md:text-3xl mt-1">{stat.value}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Actions Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 md:mb-8"
        >
          <div className="flex flex-wrap gap-2">
            {(['all', 'active', 'passed', 'pending'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 md:px-6 py-2 md:py-3 font-mono text-xs tracking-widest transition-all min-h-[44px] ${
                  activeTab === tab
                    ? 'bg-lime-400 text-black'
                    : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800'
                }`}
              >
                {tab.toUpperCase()}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowNewProposal(true)}
            className="bg-lime-400 text-black px-6 py-3 font-mono text-xs tracking-widest hover:bg-lime-300 transition-colors flex items-center gap-2 justify-center min-h-[44px]"
          >
            <span className="text-lg">+</span> NEW PROPOSAL
          </button>
        </motion.div>

        {/* Proposals Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          <AnimatePresence mode="popLayout">
            {filteredProposals.map((proposal, i) => {
              const userVote = userVotes.find(v => v.proposalId === proposal.id);
              const forPercentage = proposal.totalVotingPower > 0
                ? (proposal.votesFor / proposal.totalVotingPower) * 100
                : 0;
              const againstPercentage = proposal.totalVotingPower > 0
                ? (proposal.votesAgainst / proposal.totalVotingPower) * 100
                : 0;

              return (
                <motion.div
                  key={proposal.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.05, duration: 0.4 }}
                  className="border-2 border-zinc-800 bg-zinc-900/30 hover:border-zinc-700 transition-colors group"
                >
                  <div className="p-4 md:p-6">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`px-2 py-1 text-[10px] font-mono tracking-widest ${getStatusColor(proposal.status)}`}>
                          {proposal.status.toUpperCase()}
                        </span>
                        <span className="px-2 py-1 text-[10px] font-mono tracking-widest bg-zinc-800 text-zinc-400">
                          {proposal.category}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-zinc-600">
                        ENDS {proposal.endDate}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-display text-lg md:text-xl mb-3 group-hover:text-lime-400 transition-colors leading-tight">
                      {proposal.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-zinc-400 mb-4 md:mb-6 leading-relaxed line-clamp-2">
                      {proposal.description}
                    </p>

                    {/* Author */}
                    <div className="flex items-center gap-2 mb-4 md:mb-6">
                      <div className="w-6 h-6 bg-zinc-800 flex items-center justify-center">
                        <span className="text-[10px] font-mono text-lime-400">◆</span>
                      </div>
                      <span className="font-mono text-xs text-zinc-500">{proposal.author}</span>
                      <span className="text-[10px] text-zinc-600">·</span>
                      <span className="text-[10px] text-zinc-500 font-mono">
                        {proposal.authorHoldings.toLocaleString()} $LAUKI
                      </span>
                    </div>

                    {/* Voting Progress */}
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-[10px] font-mono text-emerald-400 tracking-widest">FOR</span>
                          <span className="text-[10px] font-mono text-zinc-500">
                            {proposal.votesFor.toLocaleString()} ({forPercentage.toFixed(1)}%)
                          </span>
                        </div>
                        <div className="h-2 bg-zinc-800 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${forPercentage}%` }}
                            transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                            className="h-full bg-emerald-400"
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-[10px] font-mono text-red-400 tracking-widest">AGAINST</span>
                          <span className="text-[10px] font-mono text-zinc-500">
                            {proposal.votesAgainst.toLocaleString()} ({againstPercentage.toFixed(1)}%)
                          </span>
                        </div>
                        <div className="h-2 bg-zinc-800 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${againstPercentage}%` }}
                            transition={{ duration: 1, delay: 0.6 + i * 0.1 }}
                            className="h-full bg-red-400"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Vote Actions */}
                    {proposal.status === 'active' && (
                      <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-zinc-800">
                        {userVote ? (
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono text-zinc-500 tracking-widest">YOUR VOTE:</span>
                            <span className={`px-3 py-1 text-[10px] font-mono tracking-widest ${
                              userVote.support ? 'bg-emerald-400/20 text-emerald-400' : 'bg-red-400/20 text-red-400'
                            }`}>
                              {userVote.support ? 'FOR' : 'AGAINST'} ({userVote.power.toLocaleString()} POWER)
                            </span>
                          </div>
                        ) : (
                          <div className="flex gap-3">
                            <button
                              onClick={() => handleVote(proposal.id, true)}
                              className="flex-1 py-3 bg-emerald-400/10 text-emerald-400 font-mono text-xs tracking-widest hover:bg-emerald-400/20 transition-colors min-h-[44px]"
                            >
                              VOTE FOR
                            </button>
                            <button
                              onClick={() => handleVote(proposal.id, false)}
                              className="flex-1 py-3 bg-red-400/10 text-red-400 font-mono text-xs tracking-widest hover:bg-red-400/20 transition-colors min-h-[44px]"
                            >
                              VOTE AGAINST
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {filteredProposals.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="border-2 border-dashed border-zinc-800 p-8 md:p-12 text-center"
          >
            <p className="font-mono text-zinc-500 text-sm">NO PROPOSALS FOUND</p>
          </motion.div>
        )}
      </main>

      {/* New Proposal Modal */}
      <AnimatePresence>
        {showNewProposal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowNewProposal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl bg-zinc-900 border-2 border-zinc-700 max-h-[90vh] overflow-y-auto"
            >
              <div className="p-4 md:p-8">
                <div className="flex items-center justify-between mb-6 md:mb-8">
                  <h2 className="font-display text-xl md:text-2xl">NEW PROPOSAL</h2>
                  <button
                    onClick={() => setShowNewProposal(false)}
                    className="w-10 h-10 bg-zinc-800 hover:bg-zinc-700 transition-colors flex items-center justify-center"
                  >
                    <span className="text-xl">×</span>
                  </button>
                </div>

                <div className="space-y-4 md:space-y-6">
                  <div>
                    <label className="block text-[10px] font-mono text-zinc-500 tracking-widest mb-2">
                      CATEGORY
                    </label>
                    <select
                      value={newProposal.category}
                      onChange={(e) => setNewProposal({ ...newProposal, category: e.target.value })}
                      className="w-full bg-zinc-800 border-2 border-zinc-700 px-4 py-3 font-mono text-sm focus:border-lime-400 outline-none min-h-[44px]"
                    >
                      <option value="GOVERNANCE">GOVERNANCE</option>
                      <option value="TREASURY">TREASURY</option>
                      <option value="ECOSYSTEM">ECOSYSTEM</option>
                      <option value="PROTOCOL">PROTOCOL</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-zinc-500 tracking-widest mb-2">
                      TITLE
                    </label>
                    <input
                      type="text"
                      value={newProposal.title}
                      onChange={(e) => setNewProposal({ ...newProposal, title: e.target.value })}
                      placeholder="Enter proposal title..."
                      className="w-full bg-zinc-800 border-2 border-zinc-700 px-4 py-3 font-mono text-sm focus:border-lime-400 outline-none placeholder:text-zinc-600 min-h-[44px]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-zinc-500 tracking-widest mb-2">
                      DESCRIPTION
                    </label>
                    <textarea
                      value={newProposal.description}
                      onChange={(e) => setNewProposal({ ...newProposal, description: e.target.value })}
                      placeholder="Describe your proposal..."
                      rows={6}
                      className="w-full bg-zinc-800 border-2 border-zinc-700 px-4 py-3 font-mono text-sm focus:border-lime-400 outline-none placeholder:text-zinc-600 resize-none"
                    />
                  </div>

                  <div className="bg-zinc-800/50 border border-zinc-700 p-4">
                    <p className="text-[10px] font-mono text-zinc-500 tracking-widest mb-2">YOUR VOTING POWER</p>
                    <p className="font-display text-2xl text-lime-400">{userHoldings.toLocaleString()} $LAUKI</p>
                    <p className="text-xs text-zinc-500 mt-1">
                      Proposals require 10,000 $LAUKI minimum to submit
                    </p>
                  </div>

                  <button
                    onClick={handleSubmitProposal}
                    disabled={!newProposal.title || !newProposal.description}
                    className="w-full bg-lime-400 text-black py-4 font-mono text-sm tracking-widest hover:bg-lime-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
                  >
                    SUBMIT PROPOSAL
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="border-t border-zinc-900 mt-12 md:mt-20">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-lime-400 flex items-center justify-center">
                <span className="font-display text-black text-xs font-bold">L</span>
              </div>
              <span className="font-mono text-[10px] text-zinc-600 tracking-widest">
                DECENTRALIZED GOVERNANCE · COMMUNITY-DRIVEN
              </span>
            </div>
            <p className="text-zinc-600 text-xs font-mono">
              Requested by @Wassieweb3 · Built by @clonkbot
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
