# Simulador de Formatação e Instalação do Windows

Página web que simula, do início ao fim, o processo de **ligar um computador, formatar o disco e instalar o Windows**. Foi feita para ser usada em **apresentações**, aulas e demonstrações, sem precisar de máquina virtual nem de instalação real.

Feito com HTML, CSS e JavaScript puro, sem dependências, sem build e sem internet.

> Projeto educacional. Não usa o logotipo oficial da Microsoft (o ícone é um genérico de quatro quadrados) e não instala nada de verdade.

## Como usar

1. Baixe ou clone o repositório.
2. Abra o arquivo `index.html` em qualquer navegador moderno (Chrome, Edge, Firefox).
3. Aperte **F** para entrar em tela cheia e comece a apresentação.

Também funciona hospedado no GitHub Pages: em *Settings → Pages*, escolha a branch principal e a pasta raiz.

## Etapas simuladas

| # | Etapa | O que acontece |
|---|-------|----------------|
| 1 | Computador desligado | Tela preta com botão de ligar |
| 2 | Inicialização | Tela da BIOS (CPU, memória, discos) e boot pelo USB/DVD |
| 3 | Idioma | Idioma, formato de hora e teclado |
| 4 | Instalar agora | Tela inicial do instalador |
| 5 | Licença | Termos de licença com caixa de aceite |
| 6 | Tipo de instalação | Atualização ou personalizada |
| 7 | **Formatação do disco** | Selecionar a partição, formatar ou excluir, com confirmação e barra de progresso |
| 8 | Instalando | Copiando arquivos, recursos, atualizações e conclusão |
| 9 | Reinício | Contagem regressiva e boot pelo disco rígido |
| 10 | Preparando | Preparando dispositivos |
| 11 | Região | Escolha da região |
| 12 | Usuário | Nome do usuário (aparece nas telas seguintes) |
| 13 | Finalizando | Mensagens de boas-vindas |
| 14 | Área de trabalho | Desktop com barra de tarefas e relógio |

## Controles

| Tecla | Ação |
|-------|------|
| `→` / `Enter` | Próxima etapa |
| `←` | Etapa anterior |
| `A` | Liga ou desliga o **modo automático**, que avança sozinho e simula a formatação |
| `L` | Liga ou desliga o **loop**: no modo automático, ao chegar na área de trabalho a simulação recomeça do início após 6 segundos |
| `F` | Tela cheia |
| `R` | Reinicia a simulação |
| `H` | **Oculta ou mostra** a barra de controles |

A barra de controles fica na parte inferior da tela, com botões equivalentes. Depois de ocultada, o botão **☰ Mostrar barra** aparece no canto inferior direito ao mover o mouse.

## Estrutura do projeto

```
simulador-instalacao-windows/
├── index.html      # Estrutura das telas (uma <section> por etapa)
├── css/
│   └── style.css   # Estilos do instalador, boot, desktop e barra de controles
├── js/
│   └── main.js     # Navegação, animações, formatação, modo automático
└── README.md
```

## Personalização

- **Textos e telas:** edite as seções `<section class="stage">` em `index.html`.
- **Cores e visual:** ajuste `css/style.css`. Os blocos são separados por comentários (Instalador, Boot, OOBE, Desktop e Barra de controles).
- **Tempos das animações:** ajuste os intervalos em `js/main.js`, por exemplo em `runInstall()`, `runPost()` e `runPrep()`.
- **Nova etapa:** adicione uma `<section class="stage" data-name="Nome">` em `index.html`, na posição desejada. Se ela precisar de animação, trate o nome em `enter()` no `main.js`.

## Licença

Uso livre para fins educacionais e de apresentação. Escolha a licença que preferir para o seu repositório (por exemplo, MIT).
