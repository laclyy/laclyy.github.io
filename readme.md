# Lacly — portfolio video editor

Un portfolio statico, veloce e responsive. I contenuti si modificano tramite tre file JSON: non serve intervenire sui componenti del sito.

I video presenti alla prima installazione sono esempi dimostrativi: sostituiscili con i tuoi lavori e i tuoi link prima della pubblicazione.

## Le tre cose che modificherai più spesso

- `public/data/videos.json` — video, categorie, stili e lavori in evidenza.
- `public/data/profile.json` — nome, bio, email e testi della Home.
- `public/data/socials.json` — Discord e profili social.

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
  "thumbnailUrl": "https://esempio.com/thumbnail.jpg",
  "videoUrl": "https://www.youtube.com/watch?v=ID_VIDEO",
  "source": "youtube",
  "tags": ["anime", "dark", "sync"],
  "featured": true,
  "date": "2026-07-03"
}
```

Valori disponibili:

- `type`: `my-edit` oppure `commissioned`.
- `category`: `anime`, `videogiochi` oppure `altro`.
- `style`: `simple edit`, `vibe edit`, `typography`, `promo edit`, `flow edit`, `cinematic edit`, `amv`, `gmv` oppure `altro`.
- `source`: `local`, `youtube`, `vimeo`, `dailymotion` oppure `external`.
- `date`: usa sempre il formato anno-mese-giorno, per esempio `2026-07-03`. L’archivio usa questa data per mostrare prima i lavori più recenti.
- `tags`: parole utili per la ricerca interna, ognuna tra virgolette.

Per rimuovere un video, elimina l’intero blocco da `{` a `}` e controlla le virgole tra i blocchi rimasti.

Per mostrare un video nella Home imposta `"featured": true`. Usa `false` per lasciarlo soltanto nella pagina Video. La Home mostra al massimo i tre featured più recenti.

## Video esterni

È la modalità consigliata. Copia in `videoUrl` il link completo del video e imposta `source`:

- YouTube: `youtube`
- Vimeo: `vimeo`
- Dailymotion: `dailymotion`
- TikTok, Instagram o qualsiasi altro sito: `external`

YouTube, Vimeo e Dailymotion vengono incorporati nella modale. TikTok, Instagram e i link non riconosciuti mostrano un bottone che apre la piattaforma originale. Nessun player viene caricato finché una persona non apre la modale.

## Video locali MP4

Usa questa modalità soltanto per edit brevi, ben compressi e sotto 20 MB.

1. Copia il file, per esempio `mio-edit.mp4`, dentro `public/videos`.
2. Nel video JSON usa `"videoUrl": "videos/mio-edit.mp4"`.
3. Imposta `"source": "local"`.

Il file viene caricato soltanto all’apertura della modale con `preload="none"`. Le card caricano esclusivamente la thumbnail.

Non caricare video pesanti nel repository: rendono download, deploy e navigazione molto più lenti, consumano banda e possono superare i limiti di GitHub. Per video lunghi o ad alta qualità usa YouTube, Vimeo o Dailymotion.

## Thumbnail

In `thumbnailUrl` puoi usare:

- un URL completo esterno, per esempio `https://.../immagine.jpg`;
- un’immagine locale inserita in `public/thumbnails`, per esempio `thumbnails/mia-cover.jpg`;
- una stringa vuota `""`: il sito userà automaticamente la cover fallback.

Per un risultato nitido usa immagini 16:9 da circa 1280×720 px, ottimizzate in JPG, WebP o AVIF. Evita immagini molto pesanti. Le thumbnail vengono caricate in lazy loading.

## Cambiare nome, bio, email e testi

Apri `public/data/profile.json` e modifica i valori dopo i due punti. I campi più importanti sono:

- `name` e `role`;
- `shortDescription`, `longDescription` e `styleDescription`;
- `email` e `location`;
- `heroTitle`, `heroText` e `heroEyebrow`;
- i testi che terminano con `Title`, `Text` o `CtaText`.

Se cambi l’email, aggiornala anche in `public/data/socials.json` per mantenerla uguale ovunque.

## Cambiare Discord e social

Apri `public/data/socials.json` e modifica `username` e `url`. Per l’email usa `value` e un URL nel formato `mailto:indirizzo@email.it`.

Puoi eliminare un intero social oppure lasciare `url` vuoto per nasconderlo. Per aggiungerne uno, copia un blocco esistente, cambia la chiave iniziale e inserisci etichetta, username e URL.

## Note sulla privacy e sulle prestazioni

- Il sito non ha backend, database, cookie di profilazione o CMS.
- Il form contatti apre l’app email del visitatore e non salva dati.
- I player esterni vengono richiesti soltanto dopo un clic esplicito.
- Le animazioni rispettano l’opzione di sistema “riduci movimento”.
- Il routing usa `#`, una scelta affidabile per GitHub Pages e per il refresh diretto delle pagine.
