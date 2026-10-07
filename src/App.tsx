/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import {
  AetherBabylonWorld,
  AtmospherePreset,
  CameraPerspective,
} from './components/AetherBabylonWorld';
import { AetherStandaloneLobby } from './components/AetherGameModals';
import {
  DeviceControlMode,
  DeviceDetectionResult,
  inspectUserDevice,
} from './components/MobileTouchControls';
import {
  WeatherMode,
  SeasonMode,
  DesktopControlSettings,
  MobileControlSettings,
  DEFAULT_DESKTOP_SETTINGS,
  DEFAULT_MOBILE_SETTINGS,
} from './game/aetherSkyAndClouds';
import {
  CharacterCustomization,
  DEFAULT_CHARACTER_CUSTOMIZATION,
} from './game/aetherCharacterAndWeapons';
import { soundEngine } from './audio/soundEngine';

export default function App() {
  // State Layar: LOBBY (Halaman Lobby Biasa Sebelum Dunia Dimulai) vs WORLD (Dunia 3D)
  const [activeScreen, setActiveScreen] = useState<'LOBBY' | 'WORLD'>('LOBBY');

  // Pemeriksaan Perangkat Otomatis (Desktop vs Ponsel) di Lobby
  const [deviceInfo, setDeviceInfo] = useState<DeviceDetectionResult>(() =>
    inspectUserDevice()
  );
  const [controlMode, setControlMode] = useState<DeviceControlMode>(
    () => inspectUserDevice().detectedMode
  );

  // Kustomisasi Karakter & Alat/Senjata (Pedang, Tombak, Busur Panah, Bola Salju)
  const [characterCustomization, setCharacterCustomization] =
    useState<CharacterCustomization>(DEFAULT_CHARACTER_CUSTOMIZATION);

  // Pengaturan Pasti Terpisah: Desktop vs Ponsel
  const [desktopSettings, setDesktopSettings] =
    useState<DesktopControlSettings>(DEFAULT_DESKTOP_SETTINGS);
  const [mobileSettings, setMobileSettings] =
    useState<MobileControlSettings>(DEFAULT_MOBILE_SETTINGS);

  // Pengaturan Awal yang dipilih di Lobby sebelum memuat Dunia 3D
  const [initialTimeOfDay, setInitialTimeOfDay] = useState<number>(8.5);
  const [initialWeather, setInitialWeather] = useState<WeatherMode>('CERAH');
  const [initialSeason, setInitialSeason] = useState<SeasonMode>('SEMI');
  const [initialCameraMode, setInitialCameraMode] =
    useState<CameraPerspective>('THIRD_PERSON');

  // Pengaturan Fisika & Visual Dunia
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1.0);
  const [gravityScale, setGravityScale] = useState<number>(1.0);
  const [secondPersonVariant, setSecondPersonVariant] = useState<
    'SHOULDER' | 'FRONT_LOCKED'
  >('SHOULDER');
  const [atmospherePreset, setAtmospherePreset] =
    useState<AtmospherePreset>('NIGHT_SANCTUARY');
  const [bloomIntensity, setBloomIntensity] = useState<number>(0.85);
  const [isGameExpanded, setIsGameExpanded] = useState<boolean>(true);

  useEffect(() => {
    const handleResize = () => {
      setDeviceInfo(inspectUserDevice());
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (activeScreen === 'LOBBY') {
    return (
      <AetherStandaloneLobby
        deviceInfo={deviceInfo}
        controlMode={controlMode}
        onSelectControlMode={(mode) => {
          setControlMode(mode);
          soundEngine.playSelect();
        }}
        desktopSettings={desktopSettings}
        onChangeDesktopSettings={(s) => {
          setDesktopSettings(s);
          soundEngine.playSelect();
        }}
        mobileSettings={mobileSettings}
        onChangeMobileSettings={(s) => {
          setMobileSettings(s);
          soundEngine.playSelect();
        }}
        characterCustomization={characterCustomization}
        onChangeCharacterCustomization={(c) => {
          setCharacterCustomization(c);
          soundEngine.playSelect();
        }}
        initialTimeOfDay={initialTimeOfDay}
        onSelectInitialTime={(hour) => {
          setInitialTimeOfDay(hour);
          soundEngine.playSelect();
        }}
        initialWeather={initialWeather}
        onSelectInitialWeather={(w) => {
          setInitialWeather(w);
          soundEngine.playSelect();
        }}
        initialSeason={initialSeason}
        onSelectInitialSeason={(season) => {
          setInitialSeason(season);
          soundEngine.playSelect();
        }}
        initialCameraMode={initialCameraMode}
        onSelectInitialCameraMode={(cam) => {
          setInitialCameraMode(cam);
          soundEngine.playSelect();
        }}
        onEnterWorld={() => {
          soundEngine.init();
          soundEngine.playSelect();
          setActiveScreen('WORLD');
        }}
      />
    );
  }

  return (
    <main className="w-screen h-screen bg-[#04070D] text-slate-100 overflow-hidden select-none">
      <AetherBabylonWorld
        initialControlMode={controlMode}
        initialTimeOfDay={initialTimeOfDay}
        initialWeather={initialWeather}
        initialSeason={initialSeason}
        initialCameraMode={initialCameraMode}
        characterCustomization={characterCustomization}
        onChangeCharacterCustomization={setCharacterCustomization}
        desktopSettings={desktopSettings}
        onChangeDesktopSettings={setDesktopSettings}
        mobileSettings={mobileSettings}
        onChangeMobileSettings={setMobileSettings}
        onReturnToLobby={() => {
          soundEngine.playSelect();
          setActiveScreen('LOBBY');
        }}
        speedMultiplier={speedMultiplier}
        onChangeSpeedMultiplier={setSpeedMultiplier}
        gravityScale={gravityScale}
        onChangeGravityScale={setGravityScale}
        secondPersonVariant={secondPersonVariant}
        onChangeSecondPersonVariant={setSecondPersonVariant}
        atmospherePreset={atmospherePreset}
        onChangeAtmospherePreset={setAtmospherePreset}
        bloomIntensity={bloomIntensity}
        onChangeBloomIntensity={setBloomIntensity}
        isGameExpanded={isGameExpanded}
        onToggleGameExpand={() => setIsGameExpanded((prev) => !prev)}
      />
    </main>
  );
}
