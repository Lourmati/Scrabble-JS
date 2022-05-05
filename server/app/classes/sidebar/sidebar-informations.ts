import { SidebarPlayerInformations } from '@app/classes/sidebar/sidebar-player-informations';

export interface SidebarInformations {
    reserveSize: number;
    currentPlayerId: string;
    players: SidebarPlayerInformations[];
}
