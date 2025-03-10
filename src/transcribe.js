import { whisper } from 'whisper-node';
import subProcess from 'node:child_process'

export default async function transcribe(path) {

  const outPath = path.replace('.wav', '-16.wav')

  subProcess.execFile('ffmpeg', ['-i', path, '-ar', '16000', outPath], (err, stdout, stderr) => {
    if (err) {
      console.error(err)
      process.exit(1)
    } else {
      console.log(`The stdout from ffmpeg: ${stdout.toString()}`)
      console.log(`The stderr from ffmpeg: ${stderr.toString()}`)
    }
  })

  const options = {
    modelName: "tiny.en",       // default
    // modelPath: "/custom/path/to/model.bin", // use model in a custom directory (cannot use along with 'modelName')
    whisperOptions: {
      language: 'en',          // default (use 'auto' for auto detect)
      gen_file_txt: true,      // outputs .txt file
      gen_file_subtitle: false, // outputs .srt file
      gen_file_vtt: false,      // outputs .vtt file
      // word_timestamps: true     // timestamp for every word
      timestamp_size: 20      // cannot use along with word_timestamps:true
    }
  }

  const transcript = await whisper(outPath, options)

  return transcript; // output: [ {start,end,speech} ]
}