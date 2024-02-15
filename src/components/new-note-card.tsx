import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { ChangeEvent, FormEvent, useState } from 'react'
import { toast } from 'sonner'

interface NewNoteCardProps {
  onNoteCreated: (content: string) => void
}

let speechRecognition: SpeechRecognition | null = null

export function NewNoteCard({ onNoteCreated }: NewNoteCardProps) {   //props desestruturada
  const [shouldShowOnboarding, setShouldShowOnboarding] = useState(true) //onde tem o useState é um estado 
  //aqui estamos fazendo com que a frase Comece gravando uma nota em áudio ou se preferir, utilize apenas texto seja exibida ou não
  const [isRecording, setIsRecording] = useState(false)
  const [content, setContent] = useState('')
  
  function handleStartEditor() {
    setShouldShowOnboarding(false)
  }

  function handleContentChanged(event: ChangeEvent<HTMLTextAreaElement>) { //no evento que chamamos aqui não existe VALUE então dissemos que ele é um elemento HTMl
    setContent(event.target.value)
    
    if (event.target.value === '') {
      setShouldShowOnboarding(true) //assim se o usuário deletar oque digitou, a frase inicial volta
    }
  }

  function handleSaveNote(event: FormEvent) { //previne que ao salvar a nota tudo suma que seria o comportamente padrão
    event.preventDefault()

    if (content === '') {
      return
    }

    onNoteCreated(content) //retorna o que foi digitado em tempo real
    setContent('')
    toast.success('Nota criada com sucesso')
  }

  function handleStartRecording() {
    const isSpeechRecognitionAPIAvailable = 'SpeecheRecognition' in window
      || 'webkitSpeechRecognition' in window

    if (!isSpeechRecognitionAPIAvailable) {
      alert('Infelizmente seu navegador não suporta a API de gravação')
      return //return vazio faz com que o código pare de ser executado ali
    }

    setIsRecording(true)
    setShouldShowOnboarding(false)

    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition //webkit p/ chrome e o outro p/ os demais
    speechRecognition = new SpeechRecognitionAPI()

    speechRecognition.lang = 'pt-BR'
    speechRecognition.continuous = true
    speechRecognition.maxAlternatives = 1
    speechRecognition.interimResults = true

    speechRecognition.onresult = (event) => { //sobre a gravação sendo convertida em texto
      const transcription = Array.from(event.results).reduce((text, result) => {
        return text.concat(result[0].transcript)
      }, '')

      setContent(transcription)
    }

    speechRecognition.onerror = (event) => {
      console.error(event)
    }

    speechRecognition.start()
  }

  function handleStopRecording() {
    setIsRecording(false)

    if (speechRecognition !== null) { //caso a gravação seja diferente de nulo, pare a gravação
      speechRecognition.stop()
    }
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger className='rounded-md flex flex-col bg-slate-700 p-5 gap-3 text-left outline-none hover:ring-2 hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-400'> 
        <span className='text-sm font-medium text-slate-200'>
          Adicionar nota
        </span>
        <p className='text-sm leading-6 text-slate-400'> { /* leading é o line-height */ } 
          Grave uma nota em áudio que será convertida para texto automaticamente.
        </p>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className='inset-0 fixed bg-black/50' /> {/* aqui estamos estilizando o modal do Radix, inset-o coloca padding pra todos os lados como zero */}
        <Dialog.Content className='inset-0 fixed md:inset-auto md:left-1/2 md:top-1/2 overflow-hidden md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-[640px] w-full md:h-[60vh] bg-slate-700 md:rounded-md flex flex-col outline-none'>
          <Dialog.Close className='absolute right-0 top-o bg-slate-800 p-1.5 text-slate-400 hover:text-slate-100'>
            <X className='size-5'/>
          </Dialog.Close>
          
        <form className='flex-1 flex flex-col'>
          <div className='flex flex-1 flex-col gap-3 p-5'>
            <span className='text-sm font-medium text-slate-300'>
              Adicionar nota
            </span>

            {shouldShowOnboarding ? ( //isso é uma condição como se tivesse um IF e um ELSE mas com ? e :
              <p className='text-sm leading-6 text-slate-400'> 
                Comece <button type='button' onClick={handleStartRecording} className='font-medium text-lime-400 hover:underline'>gravando uma nota</button> em áudio ou se preferir, <button type='button' onClick={handleStartEditor} className='font-medium text-lime-400 hover:underline'>utilize apenas texto</button>.
              </p>
            ) : (
              <textarea 
                autoFocus 
                className='text-sm leading-6 text-slate-400 bg-transparent resize-none flex-1 outline-none'
                onChange={handleContentChanged} 
                value={content} 
              />
            )}
          </div>

          {isRecording ? ( //aqui é uma condição como se fosse IF do JS por isso entre chaves
            <button
              type='button'
              onClick={handleStopRecording}
              className='w-full flex items-center justify-center gap-2 bg-slate-900 py-4 text-center text-small text-slate-300 outline-none font-medium hover:text-slate-100'> 
              
              <div className='size-3 rounded-full bg-red-500 animate-pulse' />
              Gravando! (Clique p/ interromper)
            </button>
          ) : (      //aqui o ELSE
            <button
              type='button'
              onClick={handleSaveNote}
              className='w-full bg-lime-400 py-4 text-center text-small text-lime-950 outline-none font-medium hover:bg-lime-500'> 
              Salvar nota
            </button>
          )} 
        </form>  

        </Dialog.Content> 
      </Dialog.Portal>
    </Dialog.Root>
    
  )
}