# Lacly — portfolio video editor

Un portfolio statico, veloce e responsive. I contenuti si modificano tramite tre file JSON: non serve intervenire sui componenti del sito.

I video presenti alla prima installazione sono esempi dimostrativi: sostituiscili con i tuoi lavori e i tuoi link prima della pubblicazione.

## Le tre cose che modificherai più spesso

- `public/data/videos.json` — video, categorie, stili e lavori in evidenza.
- `public/data/profile.json` — nome, bio, email e testi della Home.
- `public/data/socials.json` — Discord e profili social.
- `public/brand/lacly-pfp.png` — immagine profilo/logo usata in navbar, Home, contatti e footer.

> Importante: quando modifichi un JSON, lascia intatte virgolette, virgole e parentesi. Un editor come Visual Studio Code segnala subito eventuali errori.

## Avviare il sito sul proprio computer

Serve [Node.js](https://nodejs.org/) versione 20 o successiva.

1. Apri un terminale nella cartella del progetto.
2. Esegui `npm install` (solo la prima volta).
3. Esegui `npm run dev`.
4. Apri l’indirizzo mostrato nel terminale, normalmente `http://localhost:5173`.

Per controllare la versione finale usa:

```bash
npm run build
npm run preview
```

La cartella `dist` viene generata automaticamente e non deve essere modificata.

Durante la build viene creato anche `dist/404.html`: serve a GitHub Pages per far funzionare gli URL puliti come `/videos` e `/contact` anche quando una persona ricarica la pagina.

## Pubblicare gratis su GitHub Pages

1. Crea un nuovo repository su GitHub e carica questi file nel branch `main`.
2. Nel repository apri **Settings → Pages**.
3. Alla voce **Build and deployment → Source** scegli **GitHub Actions**.
4. Apri la scheda **Actions**: il processo “Deploy portfolio to GitHub Pages” partirà automaticamente.
5. Al termine, GitHub mostrerà l’indirizzo pubblico del sito.

Ogni modifica caricata nel branch `main` ripubblica il sito automaticamente. La configurazione Vite usa un percorso relativo, quindi funziona anche a un indirizzo come `nomeutente.github.io/nome-repository/` senza cambiare codice.

## Aggiungere un video

Apri `public/data/videos.json`. Dentro la sezione `videos`, copia un blocco esistente e incollalo dopo un altro video. Tra due blocchi deve esserci una virgola.

```json
{
  "title": "Titolo del video",
  "description": "Breve descrizione del lavoro.",
  "type": "my-edit",
  "category": "anime",
  "style": "vibe edit",
  "thumbnailUrl": "https://tuo-cloud.com/thumbs/nome-video.jpg",
  "videoUrl": "https://tuo-cloud.com/videos/nome-video.mp4",
  "source": "cloud",
  "aspectRatio": "16/9",
  "difficulty": "hard",
  "tags": ["anime", "dark", "sync"],
  "featured": true,
  "date": "2026-07-03"
}
```

Valori disponibili:

- `type`: `my-edit` oppure `commissioned`.
- `category`: `anime`, `videogiochi` oppure `altro`.
- `style`: `simple edit`, `vibe edit`, `typography`, `promo edit`, `flow edit`, `cinematic edit`, `amv`, `gmv` oppure `altro`.
- `source`: `local`, `direct`, `cloud`, `youtube`, `vimeo`, `dailymotion` oppure `external`.
- `aspectRatio`: molto consigliato per i video caricati sul server. Serve per aprire subito popup e card nella dimensione corretta, anche prima che il video parta. Puoi usare `16/9`, `9/16`, `1/1`, `4/5`, ecc.
- `difficulty`: `easy`, `medium`, `hard`, `very hard` oppure `masterpiece`. Questo valore controlla il bordo colorato delle card video.
- `date`: usa sempre il formato anno-mese-giorno, per esempio `2026-07-03`. L’archivio usa questa data per mostrare prima i lavori più recenti.
- `tags`: parole utili per la ricerca interna, ognuna tra virgolette.

Per rimuovere un video, elimina l’intero blocco da `{` a `}` e controlla le virgole tra i blocchi rimasti.

Per mostrare un video nella Home imposta `"featured": true`. Usa `false` per lasciarlo soltanto nella pagina Video. La Home mostra al massimo i tre featured più recenti.

## Video esterni

È la modalità consigliata per questo portfolio. Carica gli MP4/WebM/MOV leggeri sul tuo server/cloud, copia in `videoUrl` il link diretto del file e imposta:

```json
"source": "cloud"
```

Il video verrà riprodotto direttamente dentro la modale del sito, senza mandare il visitatore su un link esterno. Il player viene caricato solo quando una persona apre il video.

Il sito supporta ancora altre sorgenti, se servissero in futuro:

- File video diretto su cloud: `direct` oppure `cloud`
- YouTube: `youtube`
- Vimeo: `vimeo`
- Dailymotion: `dailymotion`
- TikTok, Instagram o qualsiasi altro sito: `external`

I file video diretti su cloud vengono riprodotti nella modale con il player HTML5 del browser. YouTube, Vimeo e Dailymotion vengono incorporati nella modale. TikTok, Instagram e i link non riconosciuti mostrano un bottone che apre la piattaforma originale. Nessun player viene caricato finché una persona non apre la modale.

Esempio con MP4 caricato sul tuo cloud:

```json
{
  "title": "Vertical Edit",
  "description": "Short vertical edit hosted on our cloud.",
  "type": "my-edit",
  "category": "altro",
  "style": "flow edit",
  "thumbnailUrl": "https://tuo-cloud.com/thumbs/vertical-edit.jpg",
  "videoUrl": "https://tuo-cloud.com/videos/vertical-edit.mp4",
  "source": "cloud",
  "aspectRatio": "9/16",
  "difficulty": "very hard",
  "tags": ["vertical", "sync", "short"],
  "featured": false,
  "date": "2026-07-08"
}
```

Il viewer si adatta automaticamente ai video orizzontali, verticali, quadrati e 4:5. Per i file diretti prova a usare formati compatibili con i browser moderni: MP4/H.264 è la scelta più sicura, WebM è ok, MOV funziona solo se il codec è supportato dal browser del visitatore.

## Video locali MP4

Usa questa modalità soltanto per edit brevi, ben compressi e sotto 20 MB.

1. Copia il file, per esempio `mio-edit.mp4`, dentro `public/videos`.
2. Nel video JSON usa `"videoUrl": "videos/mio-edit.mp4"`.
3. Imposta `"source": "local"`.

Il file viene caricato soltanto all’apertura della modale con `preload="none"`. Le card caricano esclusivamente la thumbnail.

Non caricare video pesanti nel repository: rendono download, deploy e navigazione molto più lenti, consumano banda e possono superare i limiti di GitHub. Per video lunghi o ad alta qualità usa il tuo cloud, YouTube, Vimeo o Dailymotion.

## Thumbnail

In `thumbnailUrl` puoi usare:

- un URL completo esterno, per esempio `https://.../immagine.jpg`;
- un’immagine locale inserita in `public/thumbnails`, per esempio `thumbnails/mia-cover.jpg`;
- una stringa vuota `""`: il sito userà automaticamente la cover fallback.

Per un risultato nitido usa immagini 16:9 da circa 1280×720 px, ottimizzate in JPG, WebP o AVIF. Evita immagini molto pesanti. Le thumbnail vengono caricate in lazy loading.

## Cambiare immagine profilo / logo

La PFP viene usata automaticamente come logo e come immagine identità in varie parti del sito.

Metodo più semplice:

1. Prepara un’immagine quadrata, per esempio 512×512 px o 1024×1024 px.
2. Salvala come PNG, JPG, WebP o SVG.
3. Caricala in:

```text
public/brand/
```

4. Consiglio: chiamala così:

```text
lacly-pfp.png
```

5. Apri `public/data/profile.json` e modifica:

```json
"avatarUrl": "brand/lacly-pfp.png"
```

Il sito è già configurato per usare:

```json
"avatarUrl": "brand/lacly-pfp.png"
```

Il placeholder SVG resta solo come fallback temporaneo se la foto non viene trovata. Evita immagini enormi: una PFP compressa sotto 500 KB è più che sufficiente.

## Cambiare nome, bio, email e testi

Apri `public/data/profile.json` e modifica i valori dopo i due punti. I campi più importanti sono:

- `name` e `role`;
- `avatarUrl`, cioè il percorso della PFP/logo;
- `shortDescription`, `longDescription` e `styleDescription`;
- `email` e `location`;
- `heroTitle`, `heroText` e `heroEyebrow`;
- i testi che terminano con `Title`, `Text` o `CtaText`.

Il flusso commissioni principale è Discord ticket, quindi l’email è solo un contatto secondario se vuoi mostrarla.

## Cambiare Discord e social

Apri `public/data/socials.json` e modifica `username` e `url`. Per l’email usa `value` e un URL nel formato `mailto:indirizzo@email.it`.

Puoi eliminare un intero social oppure lasciare `url` vuoto per nasconderlo. Per aggiungerne uno, copia un blocco esistente, cambia la chiave iniziale e inserisci etichetta, username e URL.

Per attivare il bottone delle commissioni via Discord ticket, modifica il blocco `discord` così:

```json
"discord": {
  "label": "Discord",
  "username": "lacly",
  "url": "https://discord.gg/IL-TUO-INVITE"
}
```

La Home mostra i social subito dopo la presentazione. I link con `mailto:` vengono esclusi dalla sezione social principale, così Instagram/TikTok/YouTube/X devono avere URL reali.

## Note sulla privacy e sulle prestazioni

- Il sito non ha backend, database, cookie di profilazione o CMS.
- Le commissioni vengono indirizzate al sistema ticket del server Discord.
- I player esterni vengono richiesti soltanto dopo un clic esplicito.
- Le animazioni rispettano l’opzione di sistema “riduci movimento”.
- Il routing usa URL puliti senza `#`. GitHub Pages usa il fallback `404.html` generato in build per servire correttamente le pagine interne.
