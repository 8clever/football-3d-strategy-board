import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Strategy, 
  Player, 
  Ball, 
  TacticalMarker, 
  CameraPreset, 
  ContextMenuState 
} from './types';
import { 
  loadStrategiesFromStorage, 
  saveStrategiesToStorage, 
  createFormationPlayers,
  ACTIVE_STRATEGY_KEY 
} from './data/defaultStrategies';
import { HeaderBar } from './components/HeaderBar';
import { Pitch3D } from './components/Pitch3D';
import { ContextMenu } from './components/ContextMenu';
import { CameraToolbar } from './components/CameraToolbar';
import { PlayerModal } from './components/PlayerModal';
import { StrategyModal } from './components/StrategyModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { HelpModal } from './components/HelpModal';
import { CoachNotes } from './components/CoachNotes';

export default function App() {
  // Load strategies from localStorage
  const [strategies, setStrategies] = useState<Strategy[]>(() => loadStrategiesFromStorage());
  
  const [activeStrategyId, setActiveStrategyId] = useState<string>(() => {
    const savedActive = localStorage.getItem(ACTIVE_STRATEGY_KEY);
    if (savedActive && strategies.some((s) => s.id === savedActive)) {
      return savedActive;
    }
    return strategies[0]?.id || 'strategy-press-433';
  });

  const [isDirty, setIsDirty] = useState(false);
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>('center_angled');
  const [showNames, setShowNames] = useState(true);
  const [showPassingLines, setShowPassingLines] = useState(true);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);

  // Context Menu state
  const [contextMenuState, setContextMenuState] = useState<ContextMenuState>({
    isOpen: false,
    x: 0,
    y: 0,
    targetType: 'field',
  });

  // Modals state
  const [playerModalOpen, setPlayerModalOpen] = useState(false);
  const [playerToEdit, setPlayerToEdit] = useState<Player | null>(null);
  const [strategyModalOpen, setStrategyModalOpen] = useState(false);
  const [strategyModalMode, setStrategyModalMode] = useState<'create' | 'edit'>('create');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [helpModalOpen, setHelpModalOpen] = useState(false);

  // Current active strategy
  const currentStrategy = useMemo(() => {
    return strategies.find((s) => s.id === activeStrategyId) || strategies[0];
  }, [strategies, activeStrategyId]);

  // Persist active strategy ID
  useEffect(() => {
    if (activeStrategyId) {
      localStorage.setItem(ACTIVE_STRATEGY_KEY, activeStrategyId);
    }
  }, [activeStrategyId]);

  // Helper to update current strategy state
  const updateCurrentStrategy = useCallback(
    (updater: (prev: Strategy) => Strategy, markDirty = true) => {
      setStrategies((prev) =>
        prev.map((strat) => {
          if (strat.id === activeStrategyId) {
            const updated = updater(strat);
            return { ...updated, updatedAt: Date.now() };
          }
          return strat;
        })
      );
      if (markDirty) setIsDirty(true);
    },
    [activeStrategyId]
  );

  // Manual save to localStorage
  const handleSaveStrategy = useCallback(() => {
    saveStrategiesToStorage(strategies);
    setIsDirty(false);
  }, [strategies]);

  // Select another strategy
  const handleSelectStrategy = (id: string) => {
    // If dirty, auto-save first so changes aren't lost
    if (isDirty) {
      saveStrategiesToStorage(strategies);
      setIsDirty(false);
    }
    setActiveStrategyId(id);
    setSelectedPlayerId(null);
    setContextMenuState((prev) => ({ ...prev, isOpen: false }));
  };

  // Create new strategy
  const handleOpenNewStrategy = () => {
    setStrategyModalMode('create');
    setStrategyModalOpen(true);
  };

  // Open rename/edit modal
  const handleOpenRenameStrategy = () => {
    setStrategyModalMode('edit');
    setStrategyModalOpen(true);
  };

  const handleStrategyModalSubmit = (data: {
    title: string;
    description: string;
    formationA?: '4-3-3' | '4-4-2' | '3-5-2' | '4-2-3-1';
    formationB?: '4-3-3' | '4-4-2' | '3-5-2' | '4-2-3-1';
    teamAName?: string;
    teamBName?: string;
    teamAColor?: string;
    teamBColor?: string;
    applyFormation?: boolean;
  }) => {
    if (strategyModalMode === 'create') {
      const newId = `strategy-${Date.now()}`;
      const newStrategy: Strategy = {
        id: newId,
        title: data.title,
        description: data.description,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        teamAName: data.teamAName || 'Red Team',
        teamBName: data.teamBName || 'Blue Team',
        teamAColor: data.teamAColor || '#EF4444',
        teamBColor: data.teamBColor || '#3B82F6',
        players: createFormationPlayers(data.formationA || '4-3-3', data.formationB || '4-4-2'),
        ball: { position: { x: 0, y: 0.5, z: 0 } },
        markers: [],
        arrows: [],
      };

      const updatedList = [newStrategy, ...strategies];
      setStrategies(updatedList);
      saveStrategiesToStorage(updatedList);
      setActiveStrategyId(newId);
      setIsDirty(false);
    } else {
      setStrategies((prev) => {
        const next = prev.map((strat) => {
          if (strat.id === activeStrategyId) {
            let updatedPlayers = strat.players;
            if (data.applyFormation && data.formationA && data.formationB) {
              updatedPlayers = createFormationPlayers(data.formationA, data.formationB);
            }
            return {
              ...strat,
              title: data.title,
              description: data.description,
              teamAName: data.teamAName || strat.teamAName,
              teamBName: data.teamBName || strat.teamBName,
              teamAColor: data.teamAColor || strat.teamAColor,
              teamBColor: data.teamBColor || strat.teamBColor,
              players: updatedPlayers,
              updatedAt: Date.now(),
            };
          }
          return strat;
        });
        saveStrategiesToStorage(next);
        return next;
      });
      setIsDirty(false);
    }
  };

  // Duplicate strategy
  const handleDuplicateStrategy = () => {
    if (!currentStrategy) return;

    const duplicated: Strategy = {
      ...currentStrategy,
      id: `strategy-${Date.now()}`,
      title: `${currentStrategy.title} (Copy)`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      players: currentStrategy.players.map((p) => ({ ...p, position: { ...p.position } })),
      ball: { position: { ...currentStrategy.ball.position } },
      markers: currentStrategy.markers.map((m) => ({ ...m, position: { ...m.position } })),
    };

    const updatedList = [duplicated, ...strategies];
    setStrategies(updatedList);
    saveStrategiesToStorage(updatedList);
    setActiveStrategyId(duplicated.id);
    setIsDirty(false);
  };

  // Open Delete Confirmation Modal
  const handleOpenDeleteModal = () => {
    setDeleteModalOpen(true);
  };

  // Confirm Delete strategy
  const handleConfirmDeleteStrategy = () => {
    if (strategies.length <= 1) {
      // If deleting the last/only strategy, reset to a fresh default strategy
      const resetStrategy: Strategy = {
        id: `strategy-${Date.now()}`,
        title: 'New Strategy',
        description: 'Standard 4-3-3 vs 4-4-2 setup',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        teamAName: 'Red Team',
        teamBName: 'Blue Team',
        teamAColor: '#EF4444',
        teamBColor: '#3B82F6',
        players: createFormationPlayers('4-3-3', '4-4-2'),
        ball: { position: { x: 0, y: 0.5, z: 0 } },
        markers: [],
        arrows: [],
      };
      const updatedList = [resetStrategy];
      setStrategies(updatedList);
      saveStrategiesToStorage(updatedList);
      setActiveStrategyId(resetStrategy.id);
      setIsDirty(false);
      setSelectedPlayerId(null);
    } else {
      const remaining = strategies.filter((s) => s.id !== activeStrategyId);
      setStrategies(remaining);
      saveStrategiesToStorage(remaining);
      setActiveStrategyId(remaining[0].id);
      setIsDirty(false);
      setSelectedPlayerId(null);
    }
    setDeleteModalOpen(false);
  };

  // Reset formation
  const handleResetFormation = (formation: '4-3-3' | '4-4-2' | '3-5-2' | '4-2-3-1') => {
    const freshPlayers = createFormationPlayers(formation, '4-4-2');
    updateCurrentStrategy((prev) => ({
      ...prev,
      players: freshPlayers,
      ball: { position: { x: 0, y: 0.5, z: 0 } },
    }));
  };

  // Drag Player Position Change
  const handlePlayerPositionChange = (id: string, pos: { x: number; y: number; z: number }) => {
    updateCurrentStrategy((prev) => ({
      ...prev,
      players: prev.players.map((p) => (p.id === id ? { ...p, position: pos } : p)),
    }));
  };

  // Drag Ball Position Change
  const handleBallPositionChange = (pos: { x: number; y: number; z: number }) => {
    updateCurrentStrategy((prev) => ({
      ...prev,
      ball: { position: pos },
    }));
  };

  // Coach Notes Update
  const handleNotesChange = (newNotes: string) => {
    updateCurrentStrategy((prev) => ({
      ...prev,
      description: newNotes,
    }));
  };

  // Context Menu: Pass ball to this player
  const handlePassToPlayer = (playerId: string) => {
    const targetPlayer = currentStrategy.players.find((p) => p.id === playerId);
    if (!targetPlayer) return;

    // Place ball right in front of player
    const rad = targetPlayer.rotation || 0;
    const offsetDistance = 1.2;
    const targetX = targetPlayer.position.x + Math.cos(rad) * offsetDistance;
    const targetZ = targetPlayer.position.z + Math.sin(rad) * offsetDistance;

    handleBallPositionChange({
      x: Math.max(-52, Math.min(52, targetX)),
      y: 0.5,
      z: Math.max(-33, Math.min(33, targetZ)),
    });
  };

  // Context Menu: Rotate player
  const handleRotatePlayer = (playerId: string, angleDelta: number) => {
    updateCurrentStrategy((prev) => ({
      ...prev,
      players: prev.players.map((p) =>
        p.id === playerId ? { ...p, rotation: (p.rotation || 0) + angleDelta } : p
      ),
    }));
  };

  // Context Menu: Face opponent goal
  const handleFaceGoal = (playerId: string) => {
    updateCurrentStrategy((prev) => ({
      ...prev,
      players: prev.players.map((p) => {
        if (p.id !== playerId) return p;
        // Team A attacks towards +X (angle 0); Team B attacks towards -X (angle Math.PI)
        return {
          ...p,
          rotation: p.team === 'teamA' ? 0 : Math.PI,
        };
      }),
    }));
  };

  // Context Menu: Switch player team
  const handleSwitchPlayerTeam = (playerId: string) => {
    updateCurrentStrategy((prev) => ({
      ...prev,
      players: prev.players.map((p) => {
        if (p.id !== playerId) return p;
        const newTeam = p.team === 'teamA' ? 'teamB' : 'teamA';
        return {
          ...p,
          team: newTeam,
          rotation: newTeam === 'teamA' ? 0 : Math.PI,
        };
      }),
    }));
  };

  // Context Menu: Toggle GK
  const handleToggleGoalkeeper = (playerId: string) => {
    updateCurrentStrategy((prev) => ({
      ...prev,
      players: prev.players.map((p) => {
        if (p.id !== playerId) return p;
        const isGK = !p.isGoalkeeper;
        return {
          ...p,
          isGoalkeeper: isGK,
          role: isGK ? 'GK' : p.role === 'GK' ? 'CB' : p.role,
        };
      }),
    }));
  };

  // Context Menu: Edit Player modal open
  const handleEditPlayer = (player: Player) => {
    setPlayerToEdit(player);
    setPlayerModalOpen(true);
  };

  // Save Player edits from modal
  const handleSaveEditedPlayer = (updatedPlayer: Player) => {
    updateCurrentStrategy((prev) => ({
      ...prev,
      players: prev.players.map((p) => (p.id === updatedPlayer.id ? updatedPlayer : p)),
    }));
  };

  // Context Menu: Delete Player
  const handleDeletePlayer = (playerId: string) => {
    updateCurrentStrategy((prev) => ({
      ...prev,
      players: prev.players.filter((p) => p.id !== playerId),
    }));
    if (selectedPlayerId === playerId) setSelectedPlayerId(null);
  };

  // Ball actions
  const handleMoveBallToCenter = () => {
    handleBallPositionChange({ x: 0, y: 0.5, z: 0 });
  };

  const handleMoveBallToPoint = (x: number, z: number) => {
    handleBallPositionChange({ x, y: 0.5, z });
  };

  const handlePassToNearestPlayer = () => {
    let nearest: Player | null = null;
    let minDist = Infinity;
    currentStrategy.players.forEach((p) => {
      const d = Math.hypot(p.position.x - currentStrategy.ball.position.x, p.position.z - currentStrategy.ball.position.z);
      if (d < minDist && d > 0.5) {
        minDist = d;
        nearest = p;
      }
    });
    if (nearest) {
      handlePassToPlayer((nearest as Player).id);
    }
  };

  const handleShootGoal = (isLeft: boolean) => {
    handleBallPositionChange({
      x: isLeft ? -52 : 52,
      y: 0.5,
      z: 0,
    });
  };

  // Field actions: Add player
  const handleAddPlayer = (team: 'teamA' | 'teamB', x: number, z: number) => {
    const existingTeamPlayers = currentStrategy.players.filter((p) => p.team === team);
    const highestNumber = existingTeamPlayers.reduce((max, p) => Math.max(max, p.number), 0);
    const nextNumber = highestNumber + 1;

    const newPlayer: Player = {
      id: `${team}-${Date.now()}`,
      team,
      number: nextNumber,
      name: `Player ${nextNumber}`,
      role: 'CM',
      position: { x, y: 0, z },
      rotation: team === 'teamA' ? 0 : Math.PI,
    };

    updateCurrentStrategy((prev) => ({
      ...prev,
      players: [...prev.players, newPlayer],
    }));
  };

  // Field actions: Add cone marker
  const handleAddMarker = (x: number, z: number) => {
    const newMarker: TacticalMarker = {
      id: `marker-${Date.now()}`,
      type: 'cone',
      color: '#F59E0B',
      position: { x, y: 0, z },
    };

    updateCurrentStrategy((prev) => ({
      ...prev,
      markers: [...prev.markers, newMarker],
    }));
  };

  // Marker actions: Drag, delete, recolor
  const handleMarkerPositionChange = (id: string, pos: { x: number; y: number; z: number }) => {
    updateCurrentStrategy((prev) => ({
      ...prev,
      markers: prev.markers.map((m) => (m.id === id ? { ...m, position: pos } : m)),
    }));
  };

  const handleDeleteMarker = (id: string) => {
    updateCurrentStrategy((prev) => ({
      ...prev,
      markers: prev.markers.filter((m) => m.id !== id),
    }));
  };

  const handleChangeMarkerColor = (id: string, color: string) => {
    updateCurrentStrategy((prev) => ({
      ...prev,
      markers: prev.markers.map((m) => (m.id === id ? { ...m, color } : m)),
    }));
  };

  const handleClearAllMarkers = () => {
    updateCurrentStrategy((prev) => ({
      ...prev,
      markers: [],
    }));
  };

  // Open context menu
  const handleContextMenuOpen = (
    type: 'player' | 'ball' | 'field' | 'marker',
    id: string | undefined,
    screenX: number,
    screenY: number,
    pitchCoords?: { x: number; z: number }
  ) => {
    setContextMenuState({
      isOpen: true,
      x: screenX,
      y: screenY,
      targetType: type,
      targetId: id,
      pitchCoords,
    });
  };

  const handleContextMenuClose = () => {
    setContextMenuState((prev) => ({ ...prev, isOpen: false }));
  };

  if (!currentStrategy) {
    return <div className="h-screen w-screen flex items-center justify-center bg-slate-950 text-white">Loading...</div>;
  }

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 font-sans">
      {/* Top Header Bar */}
      <HeaderBar
        strategies={strategies}
        currentStrategy={currentStrategy}
        onSelectStrategy={handleSelectStrategy}
        onSaveStrategy={handleSaveStrategy}
        onNewStrategy={handleOpenNewStrategy}
        onDuplicateStrategy={handleDuplicateStrategy}
        onDeleteStrategy={handleOpenDeleteModal}
        onResetFormation={handleResetFormation}
        isDirty={isDirty}
        onOpenRenameModal={handleOpenRenameStrategy}
      />

      {/* Main 3D Football Field Canvas */}
      <main className="relative flex-1 w-full overflow-hidden flex flex-col">
        <Pitch3D
          players={currentStrategy.players}
          ball={currentStrategy.ball}
          markers={currentStrategy.markers}
          arrows={currentStrategy.arrows}
          teamAName={currentStrategy.teamAName}
          teamBName={currentStrategy.teamBName}
          teamAColor={currentStrategy.teamAColor}
          teamBColor={currentStrategy.teamBColor}
          cameraPreset={cameraPreset}
          showNames={showNames}
          showPassingLines={showPassingLines}
          selectedPlayerId={selectedPlayerId}
          onPlayerPositionChange={handlePlayerPositionChange}
          onBallPositionChange={handleBallPositionChange}
          onMarkerPositionChange={handleMarkerPositionChange}
          onContextMenuOpen={handleContextMenuOpen}
          onSelectPlayer={setSelectedPlayerId}
        />

        {/* Coach's Notes Panel on the Left (Collapsible) */}
        <CoachNotes
          notes={currentStrategy.description || ''}
          strategyTitle={currentStrategy.title}
          onChange={handleNotesChange}
          onEditStrategy={handleOpenRenameStrategy}
        />

        {/* Camera Views & Overlay Controls */}
        <CameraToolbar
          currentPreset={cameraPreset}
          onSelectPreset={setCameraPreset}
          showNames={showNames}
          onToggleNames={() => setShowNames(!showNames)}
          showPassingLines={showPassingLines}
          onTogglePassingLines={() => setShowPassingLines(!showPassingLines)}
          onResetView={() => setCameraPreset('center_angled')}
          onOpenHelp={() => setHelpModalOpen(true)}
        />
      </main>

      {/* Context Menu on click */}
      <ContextMenu
        menuState={contextMenuState}
        players={currentStrategy.players}
        ball={currentStrategy.ball}
        markers={currentStrategy.markers}
        teamAName={currentStrategy.teamAName}
        teamBName={currentStrategy.teamBName}
        teamAColor={currentStrategy.teamAColor}
        teamBColor={currentStrategy.teamBColor}
        onClose={handleContextMenuClose}
        onPassToPlayer={handlePassToPlayer}
        onRotatePlayer={handleRotatePlayer}
        onFaceGoal={handleFaceGoal}
        onSwitchPlayerTeam={handleSwitchPlayerTeam}
        onToggleGoalkeeper={handleToggleGoalkeeper}
        onEditPlayer={handleEditPlayer}
        onDeletePlayer={handleDeletePlayer}
        onMoveBallToCenter={handleMoveBallToCenter}
        onMoveBallToPoint={handleMoveBallToPoint}
        onPassToNearestPlayer={handlePassToNearestPlayer}
        onShootGoal={handleShootGoal}
        onAddPlayer={handleAddPlayer}
        onAddMarker={handleAddMarker}
        onDeleteMarker={handleDeleteMarker}
        onChangeMarkerColor={handleChangeMarkerColor}
        onClearAllMarkers={handleClearAllMarkers}
      />

      {/* Edit Player Modal */}
      <PlayerModal
        player={playerToEdit}
        isOpen={playerModalOpen}
        teamAName={currentStrategy.teamAName}
        teamBName={currentStrategy.teamBName}
        teamAColor={currentStrategy.teamAColor}
        teamBColor={currentStrategy.teamBColor}
        onClose={() => {
          setPlayerModalOpen(false);
          setPlayerToEdit(null);
        }}
        onSave={handleSaveEditedPlayer}
      />

      {/* Strategy Create / Edit Modal */}
      <StrategyModal
        isOpen={strategyModalOpen}
        mode={strategyModalMode}
        currentStrategy={currentStrategy}
        onClose={() => setStrategyModalOpen(false)}
        onSubmit={handleStrategyModalSubmit}
      />

      {/* Delete Strategy Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        strategyTitle={currentStrategy?.title || 'Strategy'}
        isLastStrategy={strategies.length <= 1}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDeleteStrategy}
      />

      {/* Help & About Modal */}
      <HelpModal
        isOpen={helpModalOpen}
        onClose={() => setHelpModalOpen(false)}
      />
    </div>
  );
}
