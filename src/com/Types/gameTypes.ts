module Types{
    export enum KeyMap{
        Left= 37,
        Up= 38, 
        Right= 39 ,
        Down= 40 ,
        space = 32
    }
    export enum Messages{
        CREATE= 0,
        LOGIN= 1,
        WELCOME= 2,
        SPAWN= 3,
        DESPAWN= 4,
        MOVE= 5,
        LOOTMOVE= 6,
        AGGRO= 7,
        ATTACK= 8,
        HIT= 9,
        HURT= 10,
        HEALTH= 11,
        CHAT= 12,
        LOOT= 13,
        EQUIP= 14,
        DROP= 15,
        TELEPORT= 16,
        DAMAGE= 17,
        POPULATION= 18,
        KILL= 19,
        LIST= 20,
        WHO= 21,
        ZONE= 22,
        DESTROY= 23,
        HP= 24,
        BLINK= 25,
        OPEN= 26,
        CHECK= 27,
        PVP= 28,
        GUILD= 29,
        GUILDERROR= 30,
        GUILDERRORTYPE=31,
        GUILDACTION=32
    }
    export enum GUILDERRORTYPE{
        DOESNOTEXIST= 1,
        BADNAME= 2,
        ALREADYEXISTS= 3,
        NOLEAVE= 4,
        BADINVITE= 5,
        GUILDRULES= 6,
        IDWARNING=7
    }
    export enum GUILDACTION{
        CONNECT= 8,
        ONLINE= 9,
        DISCONNECT= 10,
        INVITE= 11,
        LEAVE= 12,
        CREATE= 13,
        TALK= 14,
        JOIN= 15,
        POPULATION= 16
    }
    
    export enum Entities { 
        WARRIOR= 1,

        // Mobs
        RAT= 2,
        SKELETON= 3,
        GOBLIN= 4,
        OGRE= 5,
        SPECTRE= 6,
        CRAB= 7,
        BAT= 8,
        WIZARD= 9,
        EYE= 10,
        SNAKE= 11,
        SKELETON2= 12,
        BOSS= 13,
        DEATHKNIGHT= 14,

        // Armors
        FIREFOX= 20,
        CLOTHARMOR= 21,
        LEATHERARMOR= 22,
        MAILARMOR= 23,
        PLATEARMOR= 24,
        REDARMOR= 25,
        GOLDENARMOR= 26,

        // Objects
        FLASK= 35,
        BURGER= 36,
        CHEST= 37,
        FIREPOTION= 38,
        CAKE= 39,

        // NPCs
        GUARD= 40,
        KING= 41,
        OCTOCAT= 42,
        VILLAGEGIRL= 43,
        VILLAGER= 44,
        PRIEST= 45,
        SCIENTIST= 46,
        AGENT= 47,
        RICK= 48,
        NYAN= 49,
        SORCERER= 50,
        BEACHNPC= 51,
        FORESTNPC= 52,
        DESERTNPC= 53,
        LAVANPC= 54,
        CODER= 55,

        // Weapons
        SWORD1= 60,
        SWORD2= 61,
        REDSWORD= 62,
        GOLDENSWORD= 63,
        MORNINGSTAR= 64,
        AXE= 65,
        BLUESWORD= 66
    }
}