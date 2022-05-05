export interface SidebarPlayerInformations {
    playerId: string;
    playerName: string;
    score: number;
    easelSize: number;
}

export interface SidebarInformations {
    reserveSize: number;
    currentPlayerId: string;
    players: SidebarPlayerInformations[];
}
