import {MutingStrategy} from './MutingStrategy';
import {MuteUtils} from './MuteUtils';

export class MuteAllStrategy extends MutingStrategy {
  onTabActivated(): void {
    MuteUtils.muteAll();
  }

  onTabUpdate(): void {
    MuteUtils.muteAll();
  }

  onToggle(): void {
    MuteUtils.muteAll();
  }

  onSelectedTabsChange(): void {
    MuteUtils.muteAll();
  }

  onWindowFocusChanged() {
  }
}
