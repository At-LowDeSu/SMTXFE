playerIcon1 = document.querySelector('.p-icon-1');
playerIcon2 = document.querySelector('.p-icon-2');
playerIcon3 = document.querySelector('.p-icon-3');
marthIcon = document.querySelector('.marth');
demifiendIcon = document.querySelector('.demifiend');
ikeIcon = document.querySelector('.ike');
flynnIcon = document.querySelector('.flynn');
robinIcon = document.querySelector('.robin');
jokerIcon = document.querySelector('.joker');
corrinIcon = document.querySelector('.corrin');
kazuyaIcon = document.querySelector('.kazuya');
edelgardIcon = document.querySelector('.edelgard');
itsukiIcon = document.querySelector('.itsuki');
resetButton = document.querySelector('.btn-reset');
randomButton = document.querySelector('.btn-random');
playButtonOne = document.querySelector('.btn-battle-any');
playButtonTwo = document.querySelector('.btn-battle-fe');
playButtonThree = document.querySelector('.btn-battle-mt');
playButtonFour = document.querySelector('.btn-battle-r-any');
playButtonFive = document.querySelector('.btn-battle-r-fe');
playButtonSix = document.querySelector('.btn-battle-r-mt');
playerUnitAName = document.querySelector('#pu-a-name');
playerUnitBName = document.querySelector('#pu-b-name');
playerUnitCName = document.querySelector('#pu-c-name');
enemyUnitAName = document.querySelector('#eu-a-name');
enemyUnitBName = document.querySelector('#eu-b-name');
enemyUnitCName = document.querySelector('#eu-c-name');
playerBattleIcons = document.querySelectorAll('.battle-icon-player');
enemyBattleIcons = document.querySelectorAll('.battle-icon-enemy');
playerStatGroups = document.querySelectorAll('.stat-group');
enemyStatGroups = document.querySelectorAll('.stat-group-e');
textNotes = document.querySelectorAll('.textNote');
moveOptions = document.querySelectorAll('.move-option');

//Setup Variables
let selectedUnits = [];
let playerTeamGlobal = [];
let enemyTeamGlobal = [];
document.querySelector('.game-content').classList.add('removed');
let textNotesContent = [
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  '',
  ''
]; //Array must start as emptiness...
let currentMove = '';
let waitingForTarget = false;
let typeOfTarget = 'none';
let moveToCall = 'none';
let userToAttack = 'none';
let targetting = [0]; // 0 is not targetting, 1 is targetting own team, 2 is targetting opponent team
let userTurn = false;
let playerWon = false;

//Classes
class Unit {
  constructor(
    name,
    team = 'player',
    src = 'img/atlus.png',
    franchise = 'mt',
    hp = 100,
    mana = 100,
    agi = 5,
    skl = 10,
    atk = 10,
    def = 5,
    mAtk = 10,
    mDef = 5,
    moveList = [swordAttack, buffingMove, healingMove]
  ) {
    this.name = name;
    this.displayName = name;
    this.team = team;
    this.src = src;
    this.deadSrc = this.src.slice(0, 4) + 'D' + this.src.slice(4);
    this.franchise = franchise;
    this.maxHP = hp;
    this.maxMana = mana;
    this.hp = this.maxHP;
    this.mana = this.maxMana;
    this.agi = agi; //Current Stats (considering boosts from current attack)
    this.skl = skl;
    this.atk = atk;
    this.def = def;
    this.mAtk = mAtk;
    this.mDef = mDef;
    this.agiS = agi; //Starting Stats
    this.sklS = skl;
    this.atkS = atk;
    this.defS = def;
    this.mAtkS = mAtk;
    this.mDefS = mDef;
    this.maxAgi = agi; //Max Stats (in general, not really a cap)
    this.maxSkl = skl;
    this.maxAtk = atk;
    this.maxDef = def;
    this.maxMAtk = mAtk;
    this.maxMDef = mDef;
    this.alive = true;
    this.moveList = moveList;
    if (team === 'enemy') {
      this.name = 'Enemy ' + this.name;
    } else {
      this.name = 'Allied ' + this.name;
    }
  }
  takeDamage(amount) {
    if (this.alive === true) {
      this.hp = this.hp - amount;
      if (this.hp <= 0) {
        this.hp = 0;
        this.alive = false;
      }
      updateBattleDom(playerTeamGlobal, enemyTeamGlobal);
    } else {
      //Do Nothing
    }
  }
  healUnit(amount) {
    if (this.alive === true) {
      this.hp = this.hp + amount;
      if (this.hp >= this.maxHP) {
        this.hp = this.maxHP;
      }
      // displayNewText(`${this.name} has gained ${amount} HP!`);
      updateBattleDom(playerTeamGlobal, enemyTeamGlobal);
    } else {
      //Do Nothing
    }
  }
  revertStats() {
    if (this.maxAgi > this.agiS + 6) {
      displayNewText(
        `${this.name}'s agi is already at it's cap, and can't get any higher!`
      );
      this.maxAgi = this.agiS + 6;
    }
    if (this.maxSkl > this.sklS + 6) {
      displayNewText(
        `${this.name}'s skl is already at it's cap, and can't get any higher!`
      );
      this.maxSkl = this.sklS + 6;
    }
    if (this.maxAtk > this.atkS + 6) {
      displayNewText(
        `${this.name}'s atk is already at it's cap, and can't get any higher!`
      );
      this.maxAtk = this.atkS + 6;
    }
    if (this.maxDef > this.defS + 6) {
      displayNewText(
        `${this.name}'s def is already at it's cap, and can't get any higher!`
      );
      this.maxDef = this.defS + 6;
    }
    if (this.maxMAtk > this.mAtkS + 6) {
      displayNewText(
        `${this.name}'s mag is already at it's cap, and can't get any higher!`
      );
      this.maxMAtk = this.mAtkS + 6;
    }
    if (this.maxMDef > this.mDefS + 6) {
      displayNewText(
        `${this.name}'s res is already at it's cap, and can't get any higher!`
      );
      this.maxMDef = this.mDefS + 6;
    }
    this.agi = this.maxAgi;
    this.skl = this.maxSkl;
    this.atk = this.maxAtk;
    this.def = this.maxDef;
    this.mAtk = this.maxMAtk;
    this.mDef = this.maxMDef;
  }
  boost(statToBuff, amountToBuff, buffStatus = 'none') {
    if (this.alive === true) {
      switch (statToBuff) {
        case 'agi':
          this.agi += amountToBuff;
          break;
        case 'skl':
          this.skl += amountToBuff;
          break;
        case 'atk':
          this.atk += amountToBuff;
          break;
        case 'def':
          this.def += amountToBuff;
          break;
        case 'mAtk':
          this.mAtk += amountToBuff;
          break;
        case 'mDef':
          this.mDef += amountToBuff;
          break;
      }
      if (buffStatus === 'buff') {
        this.buff();
        // displayNewText(`${this.name}'s ${statToBuff} has been raised.`);
        this.revertStats();
      } else if (buffStatus === 'debuff') {
        this.debuff();
        // displayNewText(`${this.name}'s ${statToBuff} has been decreased.`);
        this.revertStats();
      }
    } else {
      //Do Nothing
    }
  }
  buff() {
    if (this.alive === true) {
      this.maxAgi = this.agi;
      this.maxSkl = this.skl;
      this.maxAtk = this.atk;
      this.maxDef = this.def;
      this.maxMAtk = this.mAtk;
      this.maxMDef = this.mDef;
    } else {
      //Do Nothing
    }
  }
  debuff() {
    if (this.alive === true) {
      this.maxAgi = this.agi;
      this.maxSkl = this.skl;
      this.maxAtk = this.atk;
      this.maxDef = this.def;
      this.maxMAtk = this.mAtk;
      this.maxMDef = this.mDef;
    } else {
      //Do Nothing
    }
  }
}

class Attack {
  constructor(
    name,
    description,
    rangeOfTargets,
    modStat,
    modAmount,
    moveStyle = 'pDamage', //Can be p/mDamage, heal, de/buff, or special
    manaCost = 0,
    effect = ''
  ) {
    this.name = name; //This is what the attack will show on the attack menu
    this.description = description; //This is what will show when previewing the attack.
    this.rangeOfTargets = rangeOfTargets; // 'Self', 'Enemy', 'Team', 'ETeam', 'Ally'
    this.effect = effect; //This should be a function for unique effects to be called
    this.modStat = modStat; //What stat should be boosted when using this attack?
    this.modAmount = modAmount; //How much should the stat go up?
    this.moveStyle = moveStyle;
    this.manaCost = manaCost;
  }
  selectAttack(user) {
    userTurn = true;
    if (user.alive === false) {
      //Do nothing
    } else {
      if (this.rangeOfTargets === 'Team') {
        let newTarget = [
          playerTeamGlobal[0],
          playerTeamGlobal[1],
          playerTeamGlobal[2]
        ];
        this.useAttack(user, newTarget);
      } else if (this.rangeOfTargets === 'ETeam') {
        let newTarget = [
          enemyTeamGlobal[0],
          enemyTeamGlobal[1],
          enemyTeamGlobal[2]
        ];
        this.useAttack(user, newTarget);
      } else if (this.rangeOfTargets === 'Self') {
        let newTarget = user;
        this.useAttack(user, newTarget);
      } else {
        waitingForTarget = true;
        typeOfTarget = this.rangeOfTargets;
        moveToCall = this;
        userToAttack = user;
      }
    }
  }
  useAttack(user, target) {
    if (!(user.mana >= this.manaCost)) {
      displayNewText(
        `${user.name} tried to use ${this.name}, but they don't have enough mana, so nothing happened.`
      );
    } else {
      user.mana -= this.manaCost;
      waitingForTarget = false;
      typeOfTarget = 'none';
      let damage = 0;
      let healAmount = 20;
      let multipleTargets = false;
      if (this.rangeOfTargets === 'Team' || this.rangeOfTargets === 'ETeam') {
        multipleTargets = true;
      }
      //Normal Combat Processing Here
      switch (this.moveStyle) {
        case 'pDamage':
          user.boost(this.modStat, this.modAmount);

          if (multipleTargets === true) {
            if (user.team === 'player') {
              target = [...enemyTeamGlobal];
            } else {
              target = [...playerTeamGlobal];
            }

            damage = calculateDamage(user.atk, target[0].def, 'normal', false);
            target[0].takeDamage(damage);
            let damage2 = calculateDamage(
              user.atk,
              target[1].def,
              'normal',
              false
            );
            target[1].takeDamage(damage2);
            let damage3 = calculateDamage(
              user.atk,
              target[2].def,
              'normal',
              false
            );
            target[2].takeDamage(damage3);
            displayNewText(
              `${user.name} strikes with ${this.name}, dealing ${damage} physical damage to ${target[0].name},  ${damage2} physical damage to ${target[1].name} and ${damage3} physical damage to ${target[2].name}!`
            );
          } else {
            damage = calculateDamage(user.atk, target.def, 'normal', false);
            target.takeDamage(damage);
            displayNewText(
              `${user.name} strikes with ${this.name}, dealing ${damage} physical damage to ${target.name}!`
            );
          }

          break;
        case 'mDamage':
          user.boost(this.modStat, this.modAmount);
          if (multipleTargets === true) {
            if (user.team === 'player') {
              target = [...enemyTeamGlobal];
            } else {
              target = [...playerTeamGlobal];
            }
            damage = calculateDamage(
              user.mAtk,
              target[0].mDef,
              'normal',
              false
            );
            target[0].takeDamage(damage);
            let damage2 = calculateDamage(
              user.mAtk,
              target[1].mDef,
              'normal',
              false
            );
            target[1].takeDamage(damage2);
            let damage3 = calculateDamage(
              user.mAtk,
              target[2].mDef,
              'normal',
              false
            );
            target[2].takeDamage(damage3);
            displayNewText(
              `${user.name} blasts with ${this.name}, dealing ${damage} magical damage to ${target[0].name}, ${damage2} magical damage to  ${target[1].name} and ${damage3} magical damage to ${target[2].name}!`
            );
          } else {
            damage = calculateDamage(user.mAtk, target.mDef, 'normal', false);
            target.takeDamage(damage);
            displayNewText(
              `${user.name} blasts with ${this.name}, dealing ${damage} magical damage to ${target.name}!`
            );
          }
          break;
        case 'heal':
          // user.boost(this.modStat, this.modAmount);
          healAmount = this.modAmount;

          if (multipleTargets === true) {
            if (user.team === 'enemy') {
              target = [...enemyTeamGlobal];
              displayNewText(
                `${user.name} uses ${this.name}. The enemy team's hp is restored by ${healAmount} points.`
              );
            } else {
              target = [...playerTeamGlobal];
              displayNewText(
                `${user.name} uses ${this.name}. Your team's hp is restored by ${healAmount} points.`
              );
            }
            target[0].healUnit(healAmount);
            target[1].healUnit(healAmount);
            target[2].healUnit(healAmount);
          } else {
            displayNewText(
              `${user.name} uses ${this.name}. ${target.name}\'s HP was restored by ${healAmount} points.`
            );
            target.healUnit(healAmount);
          }

          break;
        case 'buff':
          if (multipleTargets === true) {
            if (user.team === 'enemy') {
              displayNewText(
                `${user.name} uses ${this.name}. The opposing team's ${this.modStat} has increased!`
              );
            } else {
              displayNewText(
                `${user.name} uses ${this.name}. Your team's ${this.modStat} has increased!`
              );
            }
            target[0].boost(this.modStat, this.modAmount, 'buff');
            target[1].boost(this.modStat, this.modAmount, 'buff');
            target[2].boost(this.modStat, this.modAmount, 'buff');
          } else {
            displayNewText(
              `${user.name} uses ${this.name} and their ${this.modStat} has increased!`
            );
            target.boost(this.modStat, this.modAmount, 'buff');
          }
          break;
        case 'debuff':
          if (user.team === 'enemy') {
            displayNewText(
              `${user.name} uses ${this.name}. Your team's ${this.modStat} has decreased!`
            );
          } else {
            displayNewText(
              `${user.name} uses ${this.name}. The opposing team's ${this.modStat} has decreased!`
            );
          }
          this.modAmount *= -1;
          if (multipleTargets === true) {
            target[0].boost(this.modStat, this.modAmount, 'debuff');
            target[1].boost(this.modStat, this.modAmount, 'debuff');
            target[2].boost(this.modStat, this.modAmount, 'debuff');
          } else {
            target.boost(this.modStat, this.modAmount, 'debuff');
          }
          this.modAmount *= -1;
          break;
        default:
          this.effect();
          break;
      }
    }

    killDeadUnits();
    checkForVictory();
    user.revertStats();
    updateBattleDom();
    if (userTurn === true && playerWon === false) {
      userTurn = false;
      enemyResponse();
    }
  }
}

//Instantiate Real Attacks

falchion = new Attack(
  'Falchion',
  'A light sword attack using the Falchion blade.',
  'Enemy',
  'atk',
  4,
  'pDamage',
  0
);
strongLeadership = new Attack(
  'Strong Leadership',
  'With strong leadership, you can raise your allies strength.',
  'Team',
  'atk',
  2,
  'buff',
  0
);
vulnerary = new Attack(
  'Vulnerary',
  'Using a vulnerary can recover your HP by 30 points.',
  'Self',
  'hp',
  30,
  'heal',
  0
);
magmaAxis = new Attack(
  'Magma Axis',
  'A powerful burst of flames dealing massive fire damage.',
  'Enemy',
  'mAtk',
  6,
  'mDamage',
  15
);
mediarahan = new Attack(
  'Mediarahan',
  "A powerful healing move that fully recovers the team's hp",
  'Team',
  'hp',
  100,
  'heal',
  40
);
heatWave = new Attack(
  'Heat Wave',
  'A strong physical attack dealing damage to all enemies',
  'ETeam',
  'atk',
  2,
  'pDamage',
  0
);
ragnell = new Attack(
  'Ragnell',
  'A heavy sword attack using the blade Ragnell',
  'Enemy',
  'atk',
  6,
  'pDamage',
  0
);
tenacity = new Attack(
  'Tenacity',
  'With tenacity, one can take on heavier hits with ease.',
  'Self',
  'def',
  6,
  'buff',
  0
);
aether = new Attack(
  'Aether',
  'A flaming attack using magic to deal extra physical damage',
  'Enemy',
  'atk',
  6,
  'pDamage',
  10
);
rakukajaM = new Attack(
  'Rakukaja (Magic)',
  "The Magic Version of Rakukaja raises the team's resistance.",
  'Team',
  'mDef',
  6,
  'buff',
  10
);

tarukajaM = new Attack(
  'Tarukaja (Magic)',
  "Tarukaja in it's magic form increases your team's magical output.",
  'Team',
  'mAtk',
  6,
  'buff',
  10
);

bufudyne = new Attack(
  'Bufudyne',
  'Bufudyne deals massive Ice damage.',
  'Enemy',
  'mAtk',
  6,
  'mDamage',
  10
);

thoron = new Attack(
  'Thoron',
  'Thoron deals massive Lightning damage.',
  'Enemy',
  'mAtk',
  6,
  'mDamage',
  10
);

heal = new Attack(
  'Heal',
  "Heal recovers a single ally's HP by 30 points.",
  'Ally',
  'hp',
  30,
  'heal',
  10
);

levinSword = new Attack(
  'Levin Sword',
  'A lightning sword dealing magical damage without the use of mana',
  'Enemy',
  'mAtk',
  6,
  'mDamage',
  0
);
gun = new Attack(
  'Gun',
  'Using a handgun, the user fires a round into the target, dealing minor physical damage.',
  'Enemy',
  'atk',
  4,
  'pDamage',
  0
);
ziodyne = new Attack(
  'Ziodyne',
  'Ziodyne deals massive Lightning damage.',
  'Enemy',
  'mAtk',
  6,
  'mDamage',
  10
);
blazingYato = new Attack(
  'Blazing Yato',
  'A light sword attack using the blade Blazing Yato',
  'Enemy',
  'atk',
  6,
  'pDamage',
  0
);
flux = new Attack(
  'Flux',
  'Flux deals minor dark damage.',
  'Enemy',
  'mAtk',
  4,
  'mDamage',
  5
);
dragonSkin = new Attack(
  'Dragon Skin',
  'With dragon skin, one can take on heavier hits with ease.',
  'Self',
  'def',
  6,
  'buff',
  0
);
authority = new Attack(
  'Authority',
  'With authority, you can raise your allies strength.',
  'Team',
  'atk',
  2,
  'buff',
  0
);
smash = new Attack(
  'Smash',
  'A heavy axe attack.',
  'Enemy',
  'atk',
  4,
  'pDamage',
  0
);
rakukajaD = new Attack(
  'Rakukaja (Defense)',
  "Rakukaja raises the user's team's defenses.",
  'Team',
  'def',
  4,
  'buff',
  10
);
fatalStrike = new Attack(
  'Fatal Strike',
  'A heavy sword attack.',
  'Enemy',
  'atk',
  6,
  'pDamage',
  0
);
//Instantiate Basic Test Attacks

swordAttack = new Attack(
  'Sword Attack',
  'Light physical attack that targets a single enemy.',
  'Enemy',
  'atk',
  3,
  'pDamage'
);
magicAttack = new Attack(
  'Magic Attack',
  'Light magic attack that targets a single enemy.',
  'Enemy',
  'mAtk',
  3,
  'mDamage',
  10
);
healingMove = new Attack(
  'Healing Move',
  'Light healing move that restores 10HP to the entire team.',
  'Team',
  'hp',
  10,
  'heal',
  20
);
buffingMove = new Attack(
  'Buffing Move',
  "Light buff that raises the team's defense by 1.",
  'Team',
  'def',
  1,
  'buff',
  20
);

//Instantiate Player Units

marth = new Unit(
  'Marth',
  'player',
  'img/units/marth.jpg',
  'fe',
  100,
  100,
  0,
  0,
  40,
  30,
  20,
  10,
  [falchion, strongLeadership, vulnerary]
);
demifiend = new Unit(
  'Demifiend',
  'player',
  'img/units/demifiend.png',
  'mt',
  100,
  100,
  0,
  0,
  40,
  30,
  20,
  10,
  [magmaAxis, mediarahan, heatWave]
);
ike = new Unit(
  'Ike',
  'player',
  'img/units/ike.jpg',
  'fe',
  100,
  100,
  0,
  0,
  40,
  30,
  20,
  10,
  [ragnell, tenacity, aether]
);

flynn = new Unit(
  'Flynn',
  'player',
  'img/units/flynn.png',
  'mt',
  100,
  100,
  0,
  0,
  30,
  15,
  30,
  15,
  [rakukajaM, tarukajaM, bufudyne]
);
robin = new Unit(
  'Robin',
  'player',
  'img/units/robin.png',
  'fe',
  100,
  100,
  0,
  0,
  20,
  10,
  40,
  30,
  [thoron, heal, levinSword]
);
joker = new Unit(
  'Joker',
  'player',
  'img/units/joker.png',
  'mt',
  100,
  100,
  0,
  0,
  30,
  15,
  30,
  15,
  [gun, ziodyne, tarukajaM]
);
corrin = new Unit(
  'Corrin',
  'player',
  'img/units/corrin.png',
  'fe',
  100,
  100,
  0,
  0,
  30,
  15,
  30,
  15,
  [blazingYato, flux, dragonSkin]
);
kazuya = new Unit(
  'Kazuya',
  'player',
  'img/units/kazuya.png',
  'mt',
  100,
  100,
  0,
  0,
  20,
  10,
  40,
  30,
  [ziodyne, rakukajaM, tarukajaM]
);
edelgard = new Unit(
  'Edelgard',
  'player',
  'img/units/edelgard.jpg',
  'fe',
  100,
  100,
  0,
  0,
  40,
  30,
  20,
  10,
  [authority, smash, vulnerary]
);
itsuki = new Unit(
  'Itsuki',
  'player',
  'img/units/itsuki.png',
  'mt',
  100,
  100,
  0,
  0,
  20,
  10,
  40,
  30,
  [ziodyne, rakukajaD, fatalStrike]
);

//Instantiate Enemy Units

marthE = new Unit(
  'Marth',
  'enemy',
  'img/units/marth.jpg',
  'fe',
  100,
  100,
  0,
  0,
  40,
  30,
  20,
  10,
  [falchion, strongLeadership, vulnerary]
);
demifiendE = new Unit(
  'Demifiend',
  'enemy',
  'img/units/demifiend.png',
  'mt',
  100,
  100,
  0,
  0,
  40,
  30,
  20,
  10,
  [magmaAxis, mediarahan, heatWave]
);
ikeE = new Unit(
  'Ike',
  'enemy',
  'img/units/ike.jpg',
  'fe',
  100,
  100,
  0,
  0,
  40,
  30,
  20,
  10,
  [ragnell, tenacity, aether]
);

flynnE = new Unit(
  'Flynn',
  'enemy',
  'img/units/flynn.png',
  'mt',
  100,
  100,
  0,
  0,
  30,
  15,
  30,
  15,
  [rakukajaM, tarukajaM, bufudyne]
);
robinE = new Unit(
  'Robin',
  'enemy',
  'img/units/robin.png',
  'fe',
  100,
  100,
  0,
  0,
  20,
  10,
  40,
  30,
  [thoron, heal, levinSword]
);
jokerE = new Unit(
  'Joker',
  'enemy',
  'img/units/joker.png',
  'mt',
  100,
  100,
  0,
  0,
  30,
  15,
  30,
  15,
  [gun, ziodyne, tarukajaM]
);
corrinE = new Unit(
  'Corrin',
  'enemy',
  'img/units/corrin.png',
  'fe',
  100,
  100,
  0,
  0,
  30,
  15,
  30,
  15,
  [blazingYato, flux, dragonSkin]
);
kazuyaE = new Unit(
  'Kazuya',
  'enemy',
  'img/units/kazuya.png',
  'mt',
  100,
  100,
  0,
  0,
  20,
  10,
  40,
  30,
  [ziodyne, rakukajaM, tarukajaM]
);
edelgardE = new Unit(
  'Edelgard',
  'enemy',
  'img/units/edelgard.jpg',
  'fe',
  100,
  100,
  0,
  0,
  40,
  30,
  20,
  10,
  [authority, smash, vulnerary]
);
itsukiE = new Unit(
  'Itsuki',
  'enemy',
  'img/units/itsuki.png',
  'mt',
  100,
  100,
  0,
  0,
  20,
  10,
  40,
  30,
  [ziodyne, rakukajaD, fatalStrike]
);

let unitList = [
  marth,
  demifiend,
  ike,
  flynn,
  robin,
  joker,
  corrin,
  kazuya,
  edelgard,
  itsuki
];
let unitListE = [
  marthE,
  demifiendE,
  ikeE,
  flynnE,
  robinE,
  jokerE,
  corrinE,
  kazuyaE,
  edelgardE,
  itsukiE
];

//Kill units with 0 HP
function killDeadUnits() {
  if (playerTeamGlobal[0].hp <= 0) {
    killUnit(playerTeamGlobal[0]);
  }
  if (playerTeamGlobal[1].hp <= 0) {
    killUnit(playerTeamGlobal[1]);
  }
  if (playerTeamGlobal[2].hp <= 0) {
    killUnit(playerTeamGlobal[2]);
  }
  if (enemyTeamGlobal[0].hp <= 0) {
    killUnit(enemyTeamGlobal[0]);
  }
  if (enemyTeamGlobal[1].hp <= 0) {
    killUnit(enemyTeamGlobal[1]);
  }
  if (enemyTeamGlobal[2].hp <= 0) {
    killUnit(enemyTeamGlobal[2]);
  }
}

//Check for Victory
function checkForVictory() {
  if (
    playerTeamGlobal[0].alive === false &&
    playerTeamGlobal[1].alive === false &&
    playerTeamGlobal[2].alive === false
  ) {
    playerLost = true;
    playerDefeat();
  } else if (
    enemyTeamGlobal[0].alive === false &&
    enemyTeamGlobal[1].alive === false &&
    enemyTeamGlobal[2].alive === false
  ) {
    playerWon = true;
    playerVictory();
  }
}

//Win the game
function playerVictory() {
  displayNewText('You have won the game. Refresh to play again.');
}

//Lose the game
function playerDefeat() {
  displayNewText('You have lost the game. Refresh to play again.');
}

//Enemy Response
function enemyResponse() {
  let randomValue = Math.ceil(Math.random() * 3);
  let randomValue2 = Math.ceil(Math.random() * 3);
  let randomValue3 = Math.ceil(Math.random() * 3);
  let unitToAttack = enemyTeamGlobal[randomValue - 1];
  while (unitToAttack.alive === false) {
    randomValue = Math.ceil(Math.random() * 3);
    unitToAttack = enemyTeamGlobal[randomValue - 1];
  }
  let attackToUse = unitToAttack.moveList[randomValue2 - 1];
  let targetOfMove;
  switch (attackToUse.rangeOfTargets) {
    case 'Self':
      targetOfMove = unitToAttack;
      break;
    case 'Ally':
      targetOfMove = enemyTeamGlobal[randomValue3 - 1];
      break;
    case 'Enemy':
      targetOfMove = playerTeamGlobal[randomValue3 - 1];
      break;
    case 'Team':
      targetOfMove = [...enemyTeamGlobal];
      break;
    case 'ETeam':
      targetOfMove = [...playerTeamGlobal];
  }
  attackToUse.useAttack(unitToAttack, targetOfMove);
}

//Update Menu Dom
function updateMenuDom() {
  document.getElementById('sm1').classList.add('invisible');
  document.getElementById('sm2').classList.add('invisible');
  document.getElementById('sm3').classList.add('invisible');
  let inTeam = selectedUnits.length;
  switch (inTeam) {
    case 0:
      playerIcon1.src = 'img/atlus.png';
      playerIcon2.src = 'img/atlus.png';
      playerIcon3.src = 'img/atlus.png';
      break;
    case 1:
      playerIcon1.src = selectedUnits[0].src;
      playerIcon2.src = 'img/atlus.png';
      playerIcon3.src = 'img/atlus.png';
      break;
    case 2:
      playerIcon1.src = selectedUnits[0].src;
      playerIcon2.src = selectedUnits[1].src;
      playerIcon3.src = 'img/atlus.png';
      break;
    case 3:
      playerIcon1.src = selectedUnits[0].src;
      playerIcon2.src = selectedUnits[1].src;
      playerIcon3.src = selectedUnits[2].src;
      break;
    default:
      playerIcon1.src = selectedUnits[0].src;
      playerIcon2.src = selectedUnits[1].src;
      playerIcon3.src = selectedUnits[2].src;
      break;
  }
}

var shuffle = function(array) {
  var currentIndex = array.length;
  var temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
};

//Battle Methods
function battleStart() {
  displayNewText(
    `${playerTeamGlobal[0].displayName}, ${playerTeamGlobal[1].displayName}, and ${playerTeamGlobal[2].displayName} are up against ${enemyTeamGlobal[0].displayName}, ${enemyTeamGlobal[1].displayName}, and ${enemyTeamGlobal[2].displayName}.`
  );
}

function killUnit(unit) {
  unit.src = unit.deadSrc;
  unit.hp = 0;
  if (unit.alive === true) {
    unit.alive = false;
    displayNewText(`The ${keyword} unit ${unit.name} has fallen in battle!`);
  }
  updateBattleDom();
}

function calculateDamage(attackStat, defenseStat, resStatus, critStatus) {
  let baseAttack = attackStat;
  if (critStatus === true) {
    baseAttack *= 1.5;
  }
  let baseDamage = baseAttack - defenseStat;
  if (baseDamage <= 0) {
    baseDamage = 0;
  }
  let finalDamage = baseDamage;
  switch (resStatus) {
    case 'resist':
      finalDamage *= 0.5;
      break;
    case 'normal':
      finalDamage = finalDamage;
      break;
    case 'weak':
      finalDamage *= 2;
      break;
    case 'repel':
      finalDamage *= -0.8;
      break;
  }
  return Math.ceil(finalDamage);
}

//Update Battle Dom
function updateBattleDom(
  playerTeam = playerTeamGlobal,
  enemyTeam = enemyTeamGlobal
) {
  playerUnitAName.innerText = playerTeam[0].displayName;
  playerUnitBName.innerText = playerTeam[1].displayName;
  playerUnitCName.innerText = playerTeam[2].displayName;
  enemyUnitAName.innerText = enemyTeam[0].displayName;
  enemyUnitBName.innerText = enemyTeam[1].displayName;
  enemyUnitCName.innerText = enemyTeam[2].displayName;
  playerBattleIcons[0].src = playerTeam[0].src;
  playerBattleIcons[1].src = playerTeam[1].src;
  playerBattleIcons[2].src = playerTeam[2].src;
  enemyBattleIcons[0].src = enemyTeam[0].src;
  enemyBattleIcons[1].src = enemyTeam[1].src;
  enemyBattleIcons[2].src = enemyTeam[2].src;
  playerStatGroups[0].firstElementChild.innerText = `HP: ${playerTeam[0].hp}/${playerTeam[0].maxHP}`;

  playerStatGroups[0].lastElementChild.innerText = `Mana: ${playerTeam[0].mana}/${playerTeam[0].maxMana}`;

  playerStatGroups[1].firstElementChild.innerText = `HP: ${playerTeam[1].hp}/${playerTeam[1].maxHP}`;

  playerStatGroups[1].lastElementChild.innerText = `Mana: ${playerTeam[1].mana}/${playerTeam[1].maxMana}`;

  playerStatGroups[2].firstElementChild.innerText = `HP: ${playerTeam[2].hp}/${playerTeam[2].maxHP}`;

  playerStatGroups[2].lastElementChild.innerText = `Mana: ${playerTeam[2].mana}/${playerTeam[2].maxMana}`;

  enemyStatGroups[0].firstElementChild.innerText = `HP: ${enemyTeam[0].hp}/${enemyTeam[0].maxHP}`;

  enemyStatGroups[0].lastElementChild.innerText = `Mana: ${enemyTeam[0].mana}/${enemyTeam[0].maxMana}`;

  enemyStatGroups[1].firstElementChild.innerText = `HP: ${enemyTeam[1].hp}/${enemyTeam[1].maxHP}`;

  enemyStatGroups[1].lastElementChild.innerText = `Mana: ${enemyTeam[1].mana}/${enemyTeam[1].maxMana}`;

  enemyStatGroups[2].firstElementChild.innerText = `HP: ${enemyTeam[2].hp}/${enemyTeam[2].maxHP}`;

  enemyStatGroups[2].lastElementChild.innerText = `Mana: ${enemyTeam[2].mana}/${enemyTeam[2].maxMana}`;

  moveOptions[0].firstElementChild.innerText = `${playerTeam[0].moveList[0].name}`;
  moveOptions[0].lastElementChild.innerText = `${playerTeam[0].moveList[0].description}`;
  moveOptions[1].firstElementChild.innerText = `${playerTeam[0].moveList[1].name}`;
  moveOptions[1].lastElementChild.innerText = `${playerTeam[0].moveList[1].description}`;
  moveOptions[2].firstElementChild.innerText = `${playerTeam[0].moveList[2].name}`;
  moveOptions[2].lastElementChild.innerText = `${playerTeam[0].moveList[2].description}`;

  moveOptions[3].firstElementChild.innerText = `${playerTeam[1].moveList[0].name}`;
  moveOptions[3].lastElementChild.innerText = `${playerTeam[1].moveList[0].description}`;
  moveOptions[4].firstElementChild.innerText = `${playerTeam[1].moveList[1].name}`;
  moveOptions[4].lastElementChild.innerText = `${playerTeam[1].moveList[1].description}`;
  moveOptions[5].firstElementChild.innerText = `${playerTeam[1].moveList[2].name}`;
  moveOptions[5].lastElementChild.innerText = `${playerTeam[1].moveList[2].description}`;

  moveOptions[6].firstElementChild.innerText = `${playerTeam[2].moveList[0].name}`;
  moveOptions[6].lastElementChild.innerText = `${playerTeam[2].moveList[0].description}`;
  moveOptions[7].firstElementChild.innerText = `${playerTeam[2].moveList[1].name}`;
  moveOptions[7].lastElementChild.innerText = `${playerTeam[2].moveList[1].description}`;
  moveOptions[8].firstElementChild.innerText = `${playerTeam[2].moveList[2].name}`;
  moveOptions[8].lastElementChild.innerText = `${playerTeam[2].moveList[2].description}`;
}

//Reset Selected Characters
function resetSelectedCharacters() {
  selectedUnits = [];
  updateMenuDom();
}

//Filter Mechanics are still broken
function randomizeTeam(condition, allignment = 'player') {
  let newTeam;
  if (allignment === 'player') {
    newTeam = [...unitList];
  } else {
    newTeam = [...unitListE];
  }

  newTeam = shuffle(newTeam);
  switch (condition) {
    case 'any':
      newTeam = [newTeam[0], newTeam[1], newTeam[2]];
      break;
    case 'fe':
      newTeam = newTeam.filter(unit => unit.franchise === 'fe');
      newTeam = [newTeam[0], newTeam[1], newTeam[2]];
      break;
    case 'mt':
      newTeam = newTeam.filter(unit => unit.franchise === 'mt');
      newTeam = [newTeam[0], newTeam[1], newTeam[2]];
      break;
  }
  return [...newTeam];
}

function teamBuilder(option) {
  let playerTeam = [...selectedUnits];
  let enemyTeam = [];
  switch (option) {
    case 0:
      if (selectedUnits.length === 3) {
        enemyTeam = randomizeTeam('any', 'Enemy');
      }
      break;
    case 1:
      if (selectedUnits.length === 3) {
        enemyTeam = randomizeTeam('fe', 'Enemy');
      }
      break;
    case 2:
      if (selectedUnits.length === 3) {
        enemyTeam = randomizeTeam('mt', 'Enemy');
      }
      break;
    case 3:
      playerTeam = randomizeTeam('any');
      enemyTeam = randomizeTeam('any', 'Enemy');
      break;
    case 4:
      playerTeam = randomizeTeam('any');
      enemyTeam = randomizeTeam('fe', 'Enemy');
      break;
    case 5:
      playerTeam = randomizeTeam('any');
      enemyTeam = randomizeTeam('mt', 'Enemy');
      break;
  }

  if (selectedUnits.length === 3) {
    playerTeamGlobal = playerTeam;
    enemyTeamGlobal = enemyTeam;
    battleProcessing(playerTeamGlobal, enemyTeamGlobal);
  } else {
    if (playerTeam.length === 3) {
      playerTeamGlobal = playerTeam;
      enemyTeamGlobal = enemyTeam;
      battleProcessing(playerTeamGlobal, enemyTeamGlobal);
    } else {
      switch (option) {
        case 0:
          document.getElementById('sm1').classList.remove('invisible');
          document.getElementById('sm2').classList.add('invisible');
          document.getElementById('sm3').classList.add('invisible');

          break;
        case 1:
          document.getElementById('sm2').classList.remove('invisible');
          document.getElementById('sm1').classList.add('invisible');
          document.getElementById('sm3').classList.add('invisible');
          break;
        case 2:
          document.getElementById('sm3').classList.remove('invisible');
          document.getElementById('sm1').classList.add('invisible');
          document.getElementById('sm2').classList.add('invisible');
          break;
      }
    }
  }
}

//Maybe add re-coloring functionality later on?
function displayNewText(textContent = 'Lorem ipsum dolor sit amet.') {
  textNotesContent.unshift(textContent);

  //Transform textNotes based on textNotesContent
  textNotes[0].innerText = textNotesContent[0];
  textNotes[1].innerText = textNotesContent[1];
  textNotes[2].innerText = textNotesContent[2];
  textNotes[3].innerText = textNotesContent[3];
  textNotes[4].innerText = textNotesContent[4];
  textNotes[5].innerText = textNotesContent[5];
  textNotes[6].innerText = textNotesContent[6];
  textNotes[7].innerText = textNotesContent[7];
  textNotes[8].innerText = textNotesContent[8];
  textNotes[9].innerText = textNotesContent[9];
  textNotes[10].innerText = textNotesContent[10];
  textNotes[11].innerText = textNotesContent[11];
  textNotes[12].innerText = textNotesContent[12];
  textNotes[13].innerText = textNotesContent[13];
  textNotes[14].innerText = textNotesContent[14];
  textNotes[15].innerText = textNotesContent[15];
  textNotes[16].innerText = textNotesContent[16];
  textNotes[17].innerText = textNotesContent[17];
  textNotes[18].innerText = textNotesContent[18];
  textNotes[19].innerText = textNotesContent[19];
}

function addUnit(unit) {
  if (!selectedUnits.includes(unit)) {
    let inTeam = selectedUnits.length;
    switch (inTeam) {
      case 0:
        selectedUnits[0] = unit;
        break;
      case 1:
        selectedUnits[1] = unit;
        break;
      case 2:
        selectedUnits[2] = unit;
        break;
      case 3:
        break;
    }
    updateMenuDom();
  }
}

//Randomize player team
function randomizePlayerTeam() {
  selectedUnits = randomizeTeam('any');
  updateMenuDom();
}

//battle processing function
function battleProcessing(playerTeam, enemyTeam) {
  document.querySelector('.menu-content').classList.add('removed');
  document.querySelector('.game-content').classList.remove('removed');
  updateBattleDom();
  battleStart();
}

// Event Listeners

marthIcon.addEventListener('click', e => {
  addUnit(marth);
});
demifiendIcon.addEventListener('click', e => {
  addUnit(demifiend);
});
ikeIcon.addEventListener('click', e => {
  addUnit(ike);
});
flynnIcon.addEventListener('click', e => {
  addUnit(flynn);
});
robinIcon.addEventListener('click', e => {
  addUnit(robin);
});
jokerIcon.addEventListener('click', e => {
  addUnit(joker);
});
corrinIcon.addEventListener('click', e => {
  addUnit(corrin);
});
kazuyaIcon.addEventListener('click', e => {
  addUnit(kazuya);
});
edelgardIcon.addEventListener('click', e => {
  addUnit(edelgard);
});
itsukiIcon.addEventListener('click', e => {
  addUnit(itsuki);
});
resetButton.addEventListener('click', e => {
  resetSelectedCharacters();
});
randomButton.addEventListener('click', e => {
  randomizePlayerTeam();
});
playButtonOne.addEventListener('click', e => {
  teamBuilder(0);
});
playButtonTwo.addEventListener('click', e => {
  teamBuilder(1);
});
playButtonThree.addEventListener('click', e => {
  teamBuilder(2);
});
playButtonFour.addEventListener('click', e => {
  teamBuilder(3);
});
playButtonFive.addEventListener('click', e => {
  teamBuilder(4);
});
playButtonSix.addEventListener('click', e => {
  teamBuilder(5);
});

//Combat Event Listeners

// Player Move Icons
playerBattleIcons[0].addEventListener('click', e => {
  if (playerTeamGlobal[0].alive === true) {
    if (waitingForTarget === true) {
      if (typeOfTarget === 'Ally') {
        moveToCall.useAttack(userToAttack, playerTeamGlobal[0]);
      }
    }
  }
});
playerBattleIcons[1].addEventListener('click', e => {
  if (playerTeamGlobal[1].alive === true) {
    if (waitingForTarget === true) {
      if (typeOfTarget === 'Ally') {
        moveToCall.useAttack(userToAttack, playerTeamGlobal[1]);
      }
    }
  }
});
playerBattleIcons[1].addEventListener('click', e => {
  if (playerTeamGlobal[1].alive === true) {
    if (waitingForTarget === true) {
      if (typeOfTarget === 'Ally') {
        moveToCall.useAttack(userToAttack, playerTeamGlobal[1]);
      }
    }
  }
});

// Enemy Move Icons
enemyBattleIcons[0].addEventListener('click', e => {
  if (enemyTeamGlobal[0].alive === true) {
    if (waitingForTarget === true) {
      if (typeOfTarget === 'Enemy') {
        moveToCall.useAttack(userToAttack, enemyTeamGlobal[0]);
      }
    }
  }
});
enemyBattleIcons[1].addEventListener('click', e => {
  if (enemyTeamGlobal[1].alive === true) {
    if (waitingForTarget === true) {
      if (typeOfTarget === 'Enemy') {
        moveToCall.useAttack(userToAttack, enemyTeamGlobal[1]);
      }
    }
  }
});
enemyBattleIcons[2].addEventListener('click', e => {
  if (enemyTeamGlobal[2].alive === true) {
    if (waitingForTarget === true) {
      if (typeOfTarget === 'Enemy') {
        moveToCall.useAttack(userToAttack, enemyTeamGlobal[2]);
      }
    }
  }
});

// Move Options
moveOptions[0].addEventListener('click', e => {
  playerTeamGlobal[0].moveList[0].selectAttack(playerTeamGlobal[0]);
});
moveOptions[1].addEventListener('click', e => {
  playerTeamGlobal[0].moveList[1].selectAttack(playerTeamGlobal[0]);
});
moveOptions[2].addEventListener('click', e => {
  playerTeamGlobal[0].moveList[2].selectAttack(playerTeamGlobal[0]);
});
moveOptions[3].addEventListener('click', e => {
  playerTeamGlobal[1].moveList[0].selectAttack(playerTeamGlobal[1]);
});
moveOptions[4].addEventListener('click', e => {
  playerTeamGlobal[1].moveList[1].selectAttack(playerTeamGlobal[1]);
});
moveOptions[5].addEventListener('click', e => {
  playerTeamGlobal[1].moveList[2].selectAttack(playerTeamGlobal[1]);
});
moveOptions[6].addEventListener('click', e => {
  playerTeamGlobal[2].moveList[0].selectAttack(playerTeamGlobal[2]);
});
moveOptions[7].addEventListener('click', e => {
  playerTeamGlobal[2].moveList[1].selectAttack(playerTeamGlobal[2]);
});
moveOptions[8].addEventListener('click', e => {
  playerTeamGlobal[2].moveList[2].selectAttack(playerTeamGlobal[2]);
});
