declare module JsonClass {

    export interface AtkRight {
        length: number;
        row: number;
    }

    export interface WalkRight {
        length: number;
        row: number;
    }

    export interface IdleRight {
        length: number;
        row: number;
    }

    export interface AtkUp {
        length: number;
        row: number;
    }

    export interface WalkUp {
        length: number;
        row: number;
    }

    export interface IdleUp {
        length: number;
        row: number;
    }

    export interface AtkDown {
        length: number;
        row: number;
    }

    export interface WalkDown {
        length: number;
        row: number;
    }

    export interface IdleDown {
        length: number;
        row: number;
    }

    export interface Animations {
        atk_right: AtkRight;
        walk_right: WalkRight;
        idle_right: IdleRight;
        atk_up: AtkUp;
        walk_up: WalkUp;
        idle_up: IdleUp;
        atk_down: AtkDown;
        walk_down: WalkDown;
        idle_down: IdleDown;
    }

    export interface RootObject {
        id: string;
        width: number;
        height: number;
        animations: Animations;
        offset_x: number;
        offset_y: number;
    }

}

