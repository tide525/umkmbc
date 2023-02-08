const tokens = ['の','、','。','に','は','を','が','と','で','年','・','（','）','さ','して','した',' いる','する','も','「','」','月','から','れた','日','こと','し','である','れて','や','２','１','いた','ある','『','』','れる','など','３','−','','この','ない','ため','日本','人','”','より','４','れ','第','いう','者','その','なった','もの','へ','後','まで',' また','市','なる','５','中','６','一','同','県','これ','１０','７','内','８','なって','おり','よる','９','大学','つ','大','国','よって','時','１２','であった','か','家','駅','ように','ら','現在','的な','本','１１','軍','上','：','化','であり','的に','なり','放送','名','性','ず','部','回','目','町','時代','それ','なかった','おいて','世界','代','線','間','戦','でも','られる','あり','会','場合','行わ','二','ついて','所','その後','東京','前','多く','州','だった','地','あった','なく','しかし','い','られた','号','数','できる','的','作品','彼','選手','他','｜','使用','機','昭和','語','られて','郡','位','研究','当時','存在','新','元','アメリカ','長','側','三','活動','映画','初','学校',' 社','等','１５','，','全','下','番組','呼ば','東','区','２０','会社','出身','および','／','車','約','のみ','代表','形','権','なお','テレビ','西','系','発売','型','以下','地域','法','開発','１４','歳','作','１３','１６','中心','チーム','たち','北','分','られ','館','鉄道','おける','時間','以降','３０','ドイツ','小','出場','一部','南','用','さらに','！','発表','度','試合','平成','＝','だ','高','学','賞','局','登場','大会','版',' 開始','（）','次','フランス','川','際','点','式','関係','曲','参加','記録','体','よう な','所属','％','多い','利用','ｍ','でき','だけ','世','．','１８','１７','シリーズ',' 明治','以上','事','ゲーム','見','お','力','##な','な','音楽','せ','シーズン','開催','##子','リーグ','島','ともに','にて','各','級','国際','いった','監督','氏','イギリス',' 山','両','世紀','問題','村','２０１０','旧','対して','優勝','知ら','都市','１９','行う','金','場','道','一般','中国','物','出演','設置','ので','せる','持つ','地方','事業','社会','卒業','戦争','共に','官','委員']

class SceneA extends Phaser.Scene {
    constructor() {
        super({key: 'sceneA'});
    }

    preload() {
        this.load.image('title', 'result_default.png');
    }

    create() {
        this.cameras.main.setBackgroundColor('#eeeeee');
        this.add.image(320, 200, 'title');

        this.add.text(320, 80, '埋め込め！バートちゃん', {
            fontSize: '2em',
            fontStyle: 'bold',
            color: 'black'
        }).setOrigin(0.5);

        this.startingText = this.add.text(320, 320, 'クリックでスタート', {
            fontSize: '2em',
            color: '#2b5283'
        }).setOrigin(0.5);
        this.tweens.add({
            targets: this.startingText,
            alpha: 0,
            duration: 1000,
            ease: 'Stepped',
            repeat: -1,
            repeatDelay: 1000,
        });

        // 画面をクリック
        this.input.manager.enabled = true;
        this.input.once('pointerdown', function() {
            this.scene.start('sceneB');
        }, this);
    }
}

class SceneB extends Phaser.Scene {
    constructor() {
        super({key: 'sceneB'});
    }

    preload() {
        this.load.spritesheet('studying', 'studying.png', {
            frameWidth: 160,
            frameHeight: 160,
        });
    }

    create() {
        // 定数
        this.numEpochs = 3;
        this.epochSeconds = 5;
        this.totalEpochSecond = this.numEpochs * this.epochSeconds;

        this.maxLoss = 10.0;

        // 変数
        this.epoch = 0;

        this.hiddenScore = 0;
        this.loss = this.maxLoss;

        this.tokenSeconds = 1;
        this.tokenBufferSeconds = 0.1;

        // 画面
        this.cameras.main.setBackgroundColor('#efefef');

        // アニメーション
        this.anims.create({
            key: 'study',
            frames: this.anims.generateFrameNumbers('studying', { frames: [ 0, 1 ] }),
            frameRate: 2,
            repeat: -1
        });
        this.add.sprite(320, 280, "bert_chan").play("study");

        // 進捗バー
        this.barWidth = 240;
        this.barHeight = 20;

        var barX = 320 - this.barWidth / 2;
        var barY = 40;
        this.bar = this.add.rectangle(barX, barY, 0, this.barHeight, 0);

        var barTextLeftX = 40;
        var barTextRightX = 160;
        var barTextConfig = { color: 'black' };
        this.add.text(barTextLeftX, barY, 'エポック', barTextConfig).setOrigin(0, 0.5);
        this.percentText = this.add.text(barTextRightX, barY, '', barTextConfig).setOrigin(1, 0.5);
        this.epochText = this.add.text(640 - barTextRightX, barY, '', barTextConfig).setOrigin(0, 0.5);
        this.secondText = this.add.text(640 - barTextLeftX, barY, '', barTextConfig).setOrigin(1, 0.5);

        // ロス
        this.lossText = this.add.text(40, 360 - 40, '', {
            color: 'black'
        }).setOrigin(0, 0.5);

        // イベント
        this.events.on('startEpoch', this.epochHandler, this);
        this.events.emit('startEpoch');
    }

    update() {
        this.lossText.setText('バリデーションロス: ' + this.loss.toFixed(2));

        var second = Math.floor(this.epochEvent.getElapsed() / 1000);
        this.bar.setSize(this.barWidth * this.epoch / this.numEpochs, this.barHeight);

        this.percentText.setText(Math.floor(this.epoch / this.numEpochs * 100) + '%');
        this.epochText.setText(this.epoch + '/' + this.numEpochs);

        var totalSecond = second + this.epoch * this.epochSeconds;
        var leftSecond = this.totalEpochSecond - totalSecond;
        this.secondText.setText(totalSecond.toString().padStart(2, '0') + '<' + leftSecond.toString().padStart(2, '0'));
    }

    epochHandler() {
        this.epochEvent = this.time.addEvent({
            delay: this.epochSeconds * 1000,
            callback: this.epochCallback,
            callbackScope: this,
        });

        // テキスト出現
        for (var i = 0; i < 10; i++) {
            var appearSeconds = Phaser.Math.FloatBetween(
                0 + this.tokenBufferSeconds,
                this.epochSeconds - (this.tokenSeconds + this.tokenBufferSeconds)
            );

            this.time.addEvent({
                delay: Math.floor(appearSeconds * 1000),
                callback: this.tokenHandler,
                callbackScope: this,
            });
        }
    }

    epochCallback() {
        if (this.epoch < 2) {
            this.epoch += 1;
            this.events.emit('startEpoch');
        }
        else {
            this.events.off('startEpoch', this.epochHandler);
            this.scene.start('sceneC', { score: this.hiddenScore });
        }
    }

    tokenHandler() {
        var x = Phaser.Math.Between(80, 560);
        var y = Phaser.Math.Between(80, 200);

        var text = this.add.text(x, y, '[MASK]', {
            fontSize: '2em',
            color: '#2b5283'
        }).setOrigin(0.5);
        text.setInteractive();

        // 一定時間後に消滅
        var disappearEvent = this.time.addEvent({
            delay: this.tokenSeconds * 1000,
            callback: function() {
                text.setVisible(false);
            },
            callbackScope: this
        });

        // クリックで消滅
        text.on('pointerdown', function() {
            // 残り時間でスコア
            this.hiddenScore += Math.floor(this.tokenSeconds * 1000 - disappearEvent.getElapsed());  // 平均333
            this.loss = this.maxLoss * Math.exp(-2 * this.hiddenScore / 10000);  // 平均の合計で正規化、適当にスケール

            // 触れない、消えない
            text.removeInteractive();
            disappearEvent.remove(false);

            // 穴を埋める
            var token = tokens[Phaser.Math.Between(0, tokens.length - 1)];
            text.setText(token)

            // ちょっとしてから消える
            this.time.addEvent({
                delay: 0.5 * 1000,
                callback: function() {
                    text.setVisible(false);
                },
                callbackScope: this
            });
        }, this);
    }
}

class SceneC extends Phaser.Scene {
    constructor() {
        super({key: 'sceneC'});
    }

    init(data) {
        this.hiddenScore = data.score;
        this.score = 100 * (1 - Math.exp(-3 * this.hiddenScore / 10000));
    }

    preload() {
        this.load.image('result-best', 'result_best.png');
        this.load.image('result-default', 'result_default.png');
        this.load.image('result-worst', 'result_worst.png');
    }

    create() {
        this.cameras.main.setBackgroundColor('#eeeeee');

        // 競合
        var members = [
            { model: 'ティーファイブ', score: 90.0, color: 'black' },
            { model: 'アルバート', score: 89.0, color: 'black' },
            { model: 'ロベルタ', score: 88.0, color: 'black' },
        ];

        // リーダーボード構築
        var me = { model: 'バート', score: this.score, color: '#e65f57' };
        members.push(me);

        members.sort((a, b) => b.score - a.score);  // スコア降順

        var rankX = 240;
        var modelX = 320;
        var scoreX = 600;

        // ヘッダ
        this.add.rectangle(400, 80, 400, 40, 0x2b5283);

        var headerY = 80;
        var headerConfig = { color: 'white' };
        this.add.text(rankX, headerY, 'ランク', headerConfig).setOrigin(1, 0.5);
        this.add.text(modelX, headerY, 'モデル', headerConfig).setOrigin(0, 0.5);
        this.add.text(scoreX, headerY, 'スコア', headerConfig).setOrigin(1, 0.5);

        // リーダーボード表示
        for (var i = 0; i < members.length; i++) {
            var member = members[i];

            var memberRank = i + 1;
            var memberModel = member.model + 'ちゃん';
            var memberScore = member.score.toFixed(2);

            var memberY = headerY + 40 * (i + 1);
            var memberConfig = { color: member.color };

            this.add.text(rankX, memberY, memberRank, memberConfig).setOrigin(1, 0.5);
            this.add.text(modelX, memberY, memberModel, memberConfig).setOrigin(0, 0.5);
            this.add.text(scoreX, memberY, memberScore, memberConfig).setOrigin(1, 0.5);
        }

        var charX = 120;
        var charY = 200;
        var myRank = members.indexOf(me) + 1;
        switch (myRank) {
            case 1:
                this.add.image(charX, charY, 'result-best');
                this.add.text(80, 120, 'ソータ！', {
                    fontSize: 'large',
                    fontStyle: 'bold',
                    color: '#e65f57'
                }).setOrigin(0.5);
                break;
            case members.length:
                this.add.image(charX, charY, 'result-worst');
                break;
            default:
                this.add.image(charX, charY, 'result-default');
        }

        this.time.addEvent({
            delay: 2000,
            callback: this.returnHandler,
            callbackScope: this
        });
    }

    update() {}

    returnHandler() {
        this.add.text(320, 320, 'タイトルに戻る', {
            fontSize: '2em',
            color: '#2b5283'
        }).setOrigin(0.5);

        // 画面クリック
        this.input.manager.enabled = true;
        this.input.once('pointerdown', function() {
            this.scene.start('sceneA');
        }, this);
    }
}
