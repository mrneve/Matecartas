/*
Título do Projeto: Matecartas

Nome do Aluno: Victor Maximo Costa Lima de Moura

Turma/Subturma: 4-D

Link para a descrição no ColabEduc: http://www.colabeduc.org/descricao/show/917

Link para o vídeo explicativo no YouTube: https://youtu.be/ebIZFxrlovI
*/

var tela=1; 

//tamanho dos botões
var xRet=15, yRet=240, altRet=40, largRet=120; 

//variável que identifica se o click do mouse acontece
var mouseClick = false;

//colisão aconteceu entre mouse e botão
var colisao = false;

//Coord x e y de cada carta
var cX=[640,840,1040,1240];
var cY=[232,232,232,232];

//variável da distância entre cada carta
var dCard = 155;

//Largura e altura das cartas
var larCard = 115; altCard = 159;

//colisao do mouse e carta
var coliCard = false, escolhaCarta = false, aux = 0; 

//coordenadas do inimigo
var iniX = 150, iniY = 60;

//coordenadas da vida do inimigo
var vidIniX = 342, vidIniY = 8;

//A pergunta foi ativada?
var pergBool = false;

//acerto conta quantas vezes acertou foi true;
var acerto = 0, acertou = false, erro = 0, errou = false;

//Pergunta foi respondida?
var respondida = false;

//caixa de resposta e seu botão
var input, button;

//contador de tempo e aux3 armazena tempo no momento atual
var cont = 0, contS = 0, aux3 = 0;

//Ligar desligar musica de menu e batalha.
var mOn = false, bOn = false;

//variáveis da equação de 2º grau
var a = [2,2,2,2];

var b = [Math.floor(Math.random()*496 + 4), Math.floor(Math.random()*496 + 4), Math.floor(Math.random()*496 + 4), Math.floor(Math.random()*496 + 4)];

//booleanos que indica se o jogador venceu
var win = false;

//minutos e segundos que o jogo durou
var minutos = 0, segundos = 0;

//variável para controlar quantas vezes o som da carta reproduzirá
var cSom = true;

//variáveis para armazenar imagens e sons
var imgFundo, titulo, cartaImg, jogoFundo, monsImg, menuM, batlM, vidaIni, vidaJog, jogAtk, monsAtk, mAtkSom, jAtkSom, cartaS, fonte, instBG, posJBG, vitP, derP, foto, wSom, dSom;

//função para carregar as imagens e sons
function preload(){
  foto = loadImage('Fotos/photo.png');
  derP = loadImage('Figuras/derrotaP.png');
  vitP = loadImage('Figuras/vitoriaP.png');
  posJBG = loadImage('Figuras/posJBG.png');
  instBG = loadImage('Figuras/Instruções2.png');
  imgFundo = loadImage('Figuras/menu-1.png');
  titulo = loadImage('Figuras/Título3.png');
  cartaImg = loadImage('Figuras/Cartas4.png');
  jogoFundo = loadImage('Figuras/CenaJogo.png');
  monsImg = loadImage('Figuras/Monstro.gif');
  monsAtk = loadImage('Figuras/MBate.gif');
  menuM = createAudio('Sons/GameMenu2.mp3');
  batlM = createAudio('Sons/Batalha.mp3');
  mAtkSom = createAudio('Sons/PedraBatendo2.mp3');
  jAtkSom = createAudio('Sons/MagiaLuz2.mp3');
  cartaS = createAudio('Sons/4CartasSom.mp3');
  wSom = createAudio('Sons/VitóriaSom.mp3');
  dSom = createAudio('Sons/DerrotaSom.mp3');
  vidaIni = loadImage('Figuras/Coracao4-1.png');
  vidaJog = loadImage('Figuras/vidaJogador.png');
}

function setup() {
  createCanvas(640, 400);
  frameRate(60);
  menuM.volume(0.5)
  batlM.speed(1.25);
  batlM.volume(0.2)
  cartaS.volume(0.5);
  cartaS.speed(1.75);
  jAtkSom.volume(0.35);
  mAtkSom.volume(0.5);
  wSom.volume(0.5);
}

function draw() {
  //procura valores fáceis tanto para "a" como para "b" para
  //obter resultado de inteiro pela equação de 2º grau
  for(k=0;k<4;k++){ //percorre o vetor a e b para dar valores
    while(Math.sqrt(b[k]/a[k])%1 != 0){
      a[k] +=1;
    }
    while(b[k] == a[k]){
      b[k]+=1;
      a[k] = 2;
    }
  }
  
  if(tela == 1){
      
      if(mOn == false){
        wSom.stop(); //para a música de vitória
        dSom.stop(); //para a música de derrota
        menuM.play();//toca música do menu
        menuM.loop(); //música do menu em loop
        mOn = true; //para não dar play na música do menu novamente
      }
    
      image(imgFundo,0,0);
      Titulo();
      Botao(xRet, yRet, largRet, altRet, "Começar", Start);
      Botao(xRet, yRet+50, largRet, altRet, "Instrução", Instruction);
      Botao(xRet, yRet+100, largRet, altRet, "Crédito", Credit);
       
      
  }
  else if(tela == 2){ //Tela de jogo
    cont = cont+1; //conta os frames
    contS = cont/60; //transforma frames em segundos
    
    if(bOn == false){//indicador se a música de batalha está ligada
      menuM.stop();
      batlM.play();
      batlM.loop();
      mOn = false; //musica menu desligar
      bOn = true; //musica batalha ligar
    }
      image(jogoFundo, 0, 0); //desenha fundo
    
      inimigo(); //desenha inimigo
    
      if(cSom){ //Se som de cartas ativado, toque som
        cartaS.speed(1.75);
        cartaS.play();
        cSom = false; //não precisa mais tocar de som
      }
    
    if(acerto < 4){ //se acertos do usuário menor que 4...
      carta();
    }
    
      if(acertou){ //se usuário acertou a resposta
        push();
          scale(4.0);
          image(jogAtk, -50, -90); //ataca o monstro
        pop();
        
        if(contS >= aux3+1.03){ //depois de 1 segundo atualiza   
          updateIni(); //atualiza inimigo
          resetGame(); //reseta as cartas para continuar
          acertou = false; //acertou volta a ser falso
          respondida = false; //respondida volta a ser falso
        }
      }
      
      if(errou){ //se usuário errou
          iniY = -400; //muda posição da img do monstro idle
          image(monsAtk, 130, 35); //imagem de atk do monstro
        
        if(contS >= aux3+1.03){ //depois de 1.03 segundos...
          iniY = 60; //volte o monstro parado para a tela
          updateJog(); //atualiza status do jogador
          resetGame(); //reseta as cartas para continuar
          errou = false; //errou volta a ser falso
          respondida = false; //respondida volta a ser falso
        }
      }
      if(win){ //se o usuário obteve vitória
        if(contS >= aux3+0.7){ //após 0.7 para dar tempo de ver animação do monstro morrendo
          
          minutos = parseInt((contS)/60);//calcula minutos
          segundos = parseInt((contS)%60);//calcula segs
          
          tela = 6; //tela recebe 6
          
          cSom = true; //som das cartas habilitado
          
          //vida volta a ser completa
          vidaIni = loadImage('Figuras/Coracao4-1.png');
          
          //monstro volta estar na posição idle
          monsImg = loadImage('Figuras/Monstro.gif');
          
          //reinicia vida do jogador
          vidaJog = loadImage('Figuras/vidaJogador.png');
          
          win = false; //win torna-se falso
        }
      }
  }
    
   else if(tela == 3){ //Tela de Instruções
    push();
      fill('#A52A2A') 
      rect(0, 0, 640, 400);
      image(instBG,0,-30);
     pop();
     
     push();
      fill('white');
      textAlign(CENTER);
      textSize(32);
      text("Instruções",width/2,35);
    pop();
     
    push();
      textSize(20);
      text("> Você estava na sua casa estudando as artes místicas da", 50,90)
     text("matemática quando de repente ouve um barulho lá fora.", 50,115)
     text("Um monstro apareceu! Utilize o poder da matemática", 50,140)
     text("para restaurar sua paz.", 50, 160);
     text("> Use o mouse para escolher uma das 4 cartas, cada carta", 50, 195);
     text("terá uma equação aleatória de 2º grau a ser resolvida.", 50, 220);
     text("> Acerte a resposta, inflinja dano no monstro até derrotá-lo!", 50, 255);
     text("Lembrando que o monstro tem 4 vidas e o jogador só tem 3.", 50, 280);
     text("Ou seja, inflinja dano quatro vezes para derrotá-lo, caso erre", 50, 305);
     text("a resposta 3 vezes, o jogador que será derrotado!", 50, 330);
    pop();
     
     Botao(xRet+230, yRet+110, largRet, altRet, "Voltar", Back);
     
  }
  
   else if(tela == 4){ //Tela de créditos
    push();
      fill('#A52A2A') 
      rect(0, 0, 640, 400);
      image(instBG,0,-30);
    pop();
      
    push();
      scale(0.7);
      rect(70,140,200,200);
      image(foto, 70, 140);
    pop();
    
    push();
      textSize(23);
      text("Desenvolvedor", 210, 170);
      text("Aluno de Ciências e Tecnologia", 210, 200);
      textStyle(BOLD);
      text("Victor Maximo", 210, 140);
      
    pop();
     
    push();
      textAlign(CENTER);
      textSize(32);
      fill('white');
      text("Créditos",width/2,35);
    pop();
     
     Botao(xRet+230, yRet+100, largRet, altRet, "Voltar", Back);
  }

   else if(tela == 5){ //tela de derrota
     
    contS = 0; // reinicia o tempo
    cont = 0;
     
    acerto = 0; //reseta quantidade de resposta correta pelo usuario
    erro = 0; //reseta quantiade de resposta errada pelo Usuario
     
    //vida volta a ser completa
    vidaIni = loadImage('Figuras/Coracao4-1.png');
     
    image(jogoFundo, 0, 0);
    image(posJBG,180,0);
    
    push();
    scale(0.7);
    image(derP, 310, 220);
    pop();
     
    push();
      textAlign(CENTER);
      textSize(32);
      text("Você Perdeu!",330,95);
    pop();
     
     Botao(xRet+250, yRet+100, largRet+20, altRet, "Tentar de novo", Back);
     
     if(bOn == true){
       batlM.stop();
       bOn = false;
     }
  }
   
   else if(tela == 6){ //Tela de Vitória
    
    cont = 0;
    contS = 0;
     
    image(jogoFundo, 0, 0);
    image(posJBG,180,0);
     
    push();
     scale(0.7);
     image(vitP, 60, 270);
    pop();
    
    iniY = 60; // monstro recebe posição 60 no y
    vidIniY = 8; //a imagem da vida recebe 8 no y
    acerto = 0; //acerto volta a ser 0 
    erro = 0; //erro volta a ser 0
     
     Botao(xRet+255, yRet+100, largRet, altRet, "Menu", Back);
     
     if(bOn == true){
       batlM.stop();
       bOn = false;
     }
     
    push();
      textAlign(CENTER);
      textSize(32);
      text("Você Ganhou!",340,95);
    pop();
     
    push();
      textSize(25);
      text("Seu tempo foi de: ",235,145);
    pop();
     
    push();
      textSize(28);
      text(+minutos+" minuto(s)", 260, 210)
      text("e "+segundos+" segundos", 250, 255)
  }
  
  mouseClick = false; //mouseClick volta a ser falso
  
}

//Vai para tela de jogo
function Start(){tela = 2;}

//Vai para tela de instrução
function Instruction(){tela = 3;} 

//Vai para tela de crédito
function Credit(){tela = 4;}

//Volta para o menu
function Back(){tela = 1;}

//Função para carregar titulo do jogo
function Titulo(){
  image(titulo, 150, 155);
} 

//Desenha o inimigo e a barra de vida na tela
function inimigo(){
   image(monsImg, iniX, iniY);
  push();
    scale(0.7)
    image(vidaIni, vidIniX,vidIniY);
  pop();
}

//atualiza a imagem da vida do inimigo
function updateIni(){
  acerto++; //acerto recebe +1 no seu valor atual
  switch(acerto){
      case(1):
        //carrega imagem da vida do inimigo -1 coração
        vidaIni = loadImage('Figuras/Coracao3-1.png');
        break;
      case(2):
      
        //carrega imagem da vida do inimigo -2 corações
        vidaIni = loadImage('Figuras/Coracao2-1.png');
      break;
    
      case(3):
        //carrega imagem da vida do inimigo -3 corações
        vidaIni = loadImage('Figuras/Coracao1-1.png');
      break;
      
      case(4):
        iniY = -20; //ajuste para a imagem de morte do monstro
        monsImg = loadImage('Figuras/MMorte.gif');//morte monstro
        vidIniY = -400 //para vida sair da tela
        win = true; //vitória se torna verdade
        aux3 = contS; //pega tempo atual do jogo
        wSom.play();
      break;
  }
}

//atualiza o jogador
function updateJog(){
  erro++; //erro recebe +1 em seu valor
  switch(erro){
      case(1):
        vidaJog = loadImage('Figuras/vidaJogador2.png')
        break;
        
      case(2):
        vidaJog = loadImage('Figuras/vidaJogador1.png')
      break;
      
      case(3):
        tela = 5; //muda para tela 5
        erro = 0; //erro volta a ser 0
        //jogador volta a ter vida cheia
        vidaJog = loadImage('Figuras/vidaJogador.png')
        dSom.play();
      break;
  }
}

//desenha cartas e aplica função de movimento
function carta(){
  
  for(var i=0;i<4;i++){ //percore vetor cX
    image(cartaImg, cX[i],cY[i]); //cria imagem pra cada cX
    if(escolhaCarta == false){ //se carta n foi escolhida...
      if(i==0){ //se for primeira carta...
        if(cX[i] - 30 > 30){ //mover ate posição cX = 30;
          cX[i] -= 30;
        }
        else{
          cX[i] = 30;
        }
      }
      else{ //se não for a primeira carta
      //cX[i] se moverá até a posição X que é a soma do                   elemento anterior (cX[i-1]) com a distancia pre-                 determinada(dCard)
        if(cX[i] - 30 > cX[i-1]+dCard){
          cX[i] -= 30;
        }
        else{
          cX[i] = cX[i-1]+dCard;
        }
      }
    }
  //verifica se houve colisão entre o mouse e a carta    
  colisaoMouseCard(mouseX,mouseY,cX[i],cY[i],altCard,larCard,i);
      
    if(escolhaCarta == false){//se carta n foi escolhida ainda
      if(coliCard == true){ // se colisão do mouse acontece
        if(cY[i] - 5 > 192){ //mova a carta no Y
          cY[i] -= 5;
        }
        else{
          cY[i] = 192; //até a posição 192
        }
      }
      else{ //caso a colisão não aconteça
        if(cY[i]+5<232){//mova a carta no Y
          cY[i]+=5;
        }
        else{
          cY[i]=232; //até a posição 232
        }
      }
    }
      
    else{ //Se a carta foi escolhida
        if(cY[i] != cY[aux]){ //Cartas diferentes da selecionada
          if(cY[i] + 4 < 400){ //mova a carta no Y
            cY[i] += 4;
          }
          else{
            cY[i] = 401; //até a posição 401, removendo-as da tela
          }
        }

      push();
        fill(255,255,179,60); 
        stroke(255,255,179,60);
        strokeWeight(3);
        //desenhe um brilho na carta selecionada
        rect(cX[aux], cY[aux], larCard, altCard);
      pop();

      if(cY[aux] - 1 > 100){ //mova a carta selecionada no Y
        cY[aux] -= 1;
      }
      else{
        cY[aux] = 100; //Até a posição 100 no Y da tela
        if(cX[aux] -10 > 30){ //Mova a carta no X da tela
          cX[aux] -= 10;
        }
        else{
          cX[aux] = 30; //até a posição 30 no X da tela
          pergunta(aux); //ative a pergunta
        }
      }
    }  
  } 
}

//reseta as informações do jogo
function resetGame(){
  for(i=0;i<4;i++){ //percorra o vetor de 4 cartas...
    if(i>0){ //se não for o primeiro cX...
      cX[i] = cX[i-1] + 200;
    }
    else{ //se for o primeiro cX...
      cX[i] = 640; //a carta volta pra fora da tela;
    }
    cY[i] = 232; //todo cY recebe posição 232
    a[i] = 2; //todo a recebe valor 2
    b[i] = Math.floor(Math.random()*496 + 4); //gera numero aleatorio para todo b
  }
    coliCard = false; //colisão de mouse e carta se torna falso
    pergBool = false; //modo pergunta é desativado
    //carta não é considerada como escolhida
    escolhaCarta = false; 
    //auxiliar não tem mais o valor da carta escolhida
    aux =  null; 
  
  if(acerto < 4){ //se os acertos do usuários são menor que 4
    cSom = true; //o barulho das cartas vai acontecer
  }
}

//Gera a pergunta para o usuário
function pergunta(index){
  image(vidaJog,280, 335) //mostra a vida do Jogador
  cartaS.stop();//para o som de carta para possibilitar o play     dela em alta velocidade
  
  //Resolva a equação ax² = b
  if(respondida == false){ //se a pergunta n foi respondida
      push();
       rect(150,130,380,120) //desenha retangulo da pergunta
       textSize(20); 
       text(a[index]+"x² = "+b[index],300, 200);//pergunta
      pop();

      push();
        textSize(18);
        text("Resolva a seguinte equação de 2º grau:", 180, 150);
      pop();
    
      push();
        textSize(12);
        text("(A resposta é sempre um inteiro)", 250, 170);
      pop();

      push();
          textSize(15);
          text("+", 224, 226); //sinais da resposta
          text("-", 226,232)
      pop();

      if(pergBool == true){ //se a pergunta foi ativada
        input = createInput(); //crie um input
        input.position(240, 213); //posicione o input
        button = createButton('Atacar'); //cria botão
        //posiciona botão
        button.position(input.x + input.width+1, 213);
        button.mousePressed(resposta);//se botão foi clicado
        //para não criar outro input e botão perBool vira falso
        pergBool = false;
        
        //calcula a resposta
        let ajuda = Math.sqrt(b[aux]/a[aux]); 
        let ajuda2 = Math.floor(ajuda*100)/100;
        console.log(ajuda2); //mostra resposta no console
      }
  }
}

//função que verifica a resposta do usuário
function resposta(){
  respondida = true; //O usuário respondeu
  
  //calcula a resposta da pergunta escolhida
  let resp = parseInt(Math.sqrt(b[aux]/a[aux]));
  
  //esconde o botão e input
  button.hide();
  input.hide();
  
  //calcula resposta fornecida pelo usuário
  let respU = input.value();
  
  if(resp == respU){ //se a resposta do usuario for correta
    console.log("ACERTOU!");
    aux3 = contS; //aux3 recebe tempo atual
    
    acertou = true; //acertou se torna verdade
    
    //animação do ataque é carregada toda vez para o gif             reiniciar a animação do começo
    jogAtk = loadImage('Figuras/HitAmarelo4.gif');
    
    //Dá play na animação de ataque ao monstro
    jAtkSom.play();
  }
  else{ 
    console.log("ERROU!")
    errou = true;
    aux3 = contS;
    mAtkSom.play()
  }
}

//verifica a colisao do mouse com as cartas
function colisaoMouseCard(xM, yM, xC, yC, altC, largC, numero){
   if(xM >= xC && xM <= xC+largC && yM >= yC && yM <= yC + altC){
       coliCard = true;
     if(mouseClick){
       escolhaCarta = true;
       pergBool = true;
       aux = numero;
     }
  }
  else{coliCard = false;}
}

//Desenha botões com suas respectivas funções
function Botao(xRet, yRet, largRet, altRet, nomeBotao, funcao){
  colisaoMouseRet(mouseX,mouseY,xRet,yRet,altRet,largRet);
  push();
      if(colisao){
        fill('#ff5c33');
        if (mouseClick) {
        funcao();
      }
      }
      else{
        fill('#b32400');
      }
     
  
      rect(xRet, yRet, largRet, altRet);
  pop();
  
  push();
    fill('white')
    textAlign(CENTER);
    textSize(20)
    text(nomeBotao,xRet+largRet/2, yRet+altRet/2+7);
  pop();
   
}

//Colisão do mouse com o retangulo dos botões
function colisaoMouseRet(xM, yM, xR, yR, altR, largR){
  if(xM >= xR && xM <= xR+largR && yM >= yR && yM <= yR + altR){
    colisao = true;
  }
  else{colisao = false;}
}

//função para detectar o clique do mouse;
function mouseClicked() {
  mouseClick = true;
}