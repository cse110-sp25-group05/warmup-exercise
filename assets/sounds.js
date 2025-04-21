// Sound Service for Blackjack Game

class SoundManager {
  constructor() {
    // audio objects - only using chip and card(toss) sounds
    this.sounds = {
      chip: new Audio('./assets/sounds/chip.mp3'),
      card: new Audio('./assets/sounds/toss.mp3')
    };
    
    // set sound volume
    Object.values(this.sounds).forEach(sound => {
      sound.volume = 0.5;
    });
    
    // check if sounds are loaded
    this.loaded = false;
    this.loadSounds();
    
    // sound mute status
    this.muted = localStorage.getItem('soundMuted') === 'true';
    if (this.muted) {
      this.muteAll();
    }
  }
  
  // load sound files
  loadSounds() {
    let loadedCount = 0;
    const totalSounds = Object.keys(this.sounds).length;
    
    // check when each sound file is loaded
    Object.values(this.sounds).forEach(sound => {
      sound.addEventListener('canplaythrough', () => {
        loadedCount++;
        if (loadedCount === totalSounds) {
          this.loaded = true;
        }
      });
      
      // continue if there's an error
      sound.addEventListener('error', (e) => {
        console.error('Error loading sound:', e);
        loadedCount++;
      });
      
      // preload sounds
      sound.load();
    });
  }
  
  // play chip sound
  playChip() {
    this.playSound('chip');
  }
  
  // play card sound
  playCard() {
    this.playSound('card');
  }
  
  // general function to play sounds
  playSound(soundName) {
    if (this.muted) return;
    
    const sound = this.sounds[soundName];
    if (sound) {
      // reset sound to start
      sound.currentTime = 0;
      sound.play().catch(error => {
        console.error(`Error playing ${soundName} sound:`, error);
      });
    }
  }
  
  // mute all sounds
  muteAll() {
    Object.values(this.sounds).forEach(sound => {
      sound.muted = true;
    });
    this.muted = true;
    localStorage.setItem('soundMuted', 'true');
  }
  
  // unmute all sounds
  unmuteAll() {
    Object.values(this.sounds).forEach(sound => {
      sound.muted = false;
    });
    this.muted = false;
    localStorage.setItem('soundMuted', 'false');
  }
  
  // toggle sound state
  toggleMute() {
    if (this.muted) {
      this.unmuteAll();
    } else {
      this.muteAll();
    }
    return this.muted;
  }
}

// create global sound manager
window.soundManager = new SoundManager(); 