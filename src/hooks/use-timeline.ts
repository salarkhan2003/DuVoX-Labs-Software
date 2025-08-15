'use client';

import { useState, useCallback } from 'react';
import type { TimelineMilestone } from '@/components/ui/interactive-timeline';
import { 
  timelineMilestones as defaultMilestones,
  getMilestoneById,
  getMilestonesByCategory,
  getMilestonesByYear,
  addMilestone as addMilestoneUtil,
  updateMilestone as updateMilestoneUtil,
  deleteMilestone as deleteMilestoneUtil
} from '@/data/timeline-milestones';

export function useTimeline(initialMilestones: TimelineMilestone[] = defaultMilestones) {
  const [milestones, setMilestones] = useState<TimelineMilestone[]>(initialMilestones);
  const [selectedMilestone, setSelectedMilestone] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Navigation functions
  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev < milestones.length - 1 ? prev + 1 : 0));
  }, [milestones.length]);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : milestones.length - 1));
  }, [milestones.length]);

  const goToIndex = useCallback((index: number) => {
    if (index >= 0 && index < milestones.length) {
      setCurrentIndex(index);
    }
  }, [milestones.length]);

  // Selection functions
  const selectMilestone = useCallback((id: string | null) => {
    setSelectedMilestone(id);
  }, []);

  const toggleMilestone = useCallback((id: string) => {
    setSelectedMilestone(prev => prev === id ? null : id);
  }, []);

  // Data management functions
  const addMilestone = useCallback((milestone: TimelineMilestone) => {
    const updatedMilestones = addMilestoneUtil(milestone);
    setMilestones(updatedMilestones);
    return updatedMilestones;
  }, []);

  const updateMilestone = useCallback((id: string, updates: Partial<TimelineMilestone>) => {
    const updatedMilestones = updateMilestoneUtil(id, updates);
    setMilestones(updatedMilestones);
    return updatedMilestones;
  }, []);

  const deleteMilestone = useCallback((id: string) => {
    const updatedMilestones = deleteMilestoneUtil(id);
    setMilestones(updatedMilestones);
    // Adjust current index if necessary
    if (currentIndex >= updatedMilestones.length) {
      setCurrentIndex(Math.max(0, updatedMilestones.length - 1));
    }
    // Clear selection if deleted milestone was selected
    if (selectedMilestone === id) {
      setSelectedMilestone(null);
    }
    return updatedMilestones;
  }, [currentIndex, selectedMilestone]);

  // Filter functions
  const getMilestoneById = useCallback((id: string) => {
    return milestones.find(milestone => milestone.id === id);
  }, [milestones]);

  const getMilestonesByCategory = useCallback((category: TimelineMilestone['category']) => {
    return milestones.filter(milestone => milestone.category === category);
  }, [milestones]);

  const getMilestonesByYear = useCallback((year: string) => {
    return milestones.filter(milestone => milestone.year === year);
  }, [milestones]);

  // Computed values
  const currentMilestone = milestones[currentIndex] || null;
  const selectedMilestoneData = selectedMilestone ? getMilestoneById(selectedMilestone) : null;
  const totalMilestones = milestones.length;
  const hasNext = currentIndex < milestones.length - 1;
  const hasPrevious = currentIndex > 0;

  return {
    // State
    milestones,
    selectedMilestone,
    currentIndex,
    currentMilestone,
    selectedMilestoneData,
    totalMilestones,
    hasNext,
    hasPrevious,

    // Navigation
    goToNext,
    goToPrevious,
    goToIndex,

    // Selection
    selectMilestone,
    toggleMilestone,

    // Data management
    addMilestone,
    updateMilestone,
    deleteMilestone,

    // Filters
    getMilestoneById,
    getMilestonesByCategory,
    getMilestonesByYear,

    // Setters for external control
    setMilestones,
    setSelectedMilestone,
    setCurrentIndex,
  };
}