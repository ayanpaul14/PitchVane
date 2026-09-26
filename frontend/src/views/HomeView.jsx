import { motion } from 'framer-motion';
import { HeroSection } from '../components/HeroSection.jsx';
import { ArchitecturePipeline } from '../components/ArchitecturePipeline.jsx';
import { CallToAction } from '../components/CallToAction.jsx';

export function HomeView({ onEnterWarRoom, onExploreDossiers, onOpenAuth }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col w-full"
    >
      {/* Full-width hero — the MeshGradient shader fills edge-to-edge */}
      <div className="w-full">
        <HeroSection
          onStartCaseClick={onEnterWarRoom}
          onLoadSampleClick={onExploreDossiers}
        />
      </div>

      {/* Remaining sections get a constrained, padded wrapper */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-12 sm:space-y-16">
        <ArchitecturePipeline />
        <CallToAction onRequestAccess={onOpenAuth} />
      </div>
    </motion.div>
  );
}
