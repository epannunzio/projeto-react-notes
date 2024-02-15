import * as Dialog from '@radix-ui/react-dialog'; //pegamos todas as importações do react dialog faz e coloca dentro de um objeto Dialog
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { X } from 'lucide-react';

interface NoteCardProps { //criamos aqui onde as informações poderão ser alteradas para cada nota
  note: {
    id: string
    date: Date
    content: string
  }

  onNoteDeleted: (id: string) => void
}

export function NoteCard({ note, onNoteDeleted }: NoteCardProps) { //props desestruturada
  return (
    <Dialog.Root>
      <Dialog.Trigger className='rounded-md text-left flex flex-col bg-slate-800 p-5 gap-3 overflow-hidden relative outline-none hover:ring-2 hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-400'> { /* focus coloca a bordinha verde com o click, focus visible coloca com o teclado, tipo o tab */ }
        <span className='text-sm font-medium text-slate-300'>
          {formatDistanceToNow(note.date, { locale: ptBR, addSuffix: true })}
        </span>
        <p className='text-sm leading-6 text-slate-400'> 
          {note.content}
        </p>

        <div className='absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/60 to-black/0 pointer-events-none' /> { /* o barra zero ou barra 60 é a opacidade e o h-1/2 é 50% de altura */ }
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className='inset-0 fixed bg-black/50' /> {/* aqui estamos estilizando o modal do Radix */}
        <Dialog.Content className='inset-0 fixed md:inset-auto md:left-1/2 md:top-1/2 overflow-hidden md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-[640px] w-full md:h-[60vh] bg-slate-700 md:rounded-md flex flex-col outline-none'>
          <Dialog.Close className='absolute right-0 top-o bg-slate-800 p-1.5 text-slate-400 hover:text-slate-100'>
            <X className='size-5'/>
          </Dialog.Close>
          
          <div className='flex flex-1 flex-col gap-3 p-5'>
            <span className='text-sm font-medium text-slate-300'>
              {formatDistanceToNow(note.date, { locale: ptBR, addSuffix: true })} {/* addSuffix: true adiciona o sufixo Há antes da frase 2 minutos no modal */}
            </span>
            <p className='text-sm leading-6 text-slate-400'> 
              {note.content}
            </p>
          </div>

          <button
            type='button'
            onClick={() => onNoteDeleted(note.id)}
            className='w-full bg-slate-800 py-4 text-center text-small text-slate-300 outline-none font-medium group'> {/*O group no elemento pai te deixa estilizar o filho*/}
            Deseja <span className='text-red-400 group-hover:underline'>apagar essa nota</span>? {/*group-hover:underline sem o group no pai, o hover só pegaria se fosse no pai*/}
          </button>

        </Dialog.Content> {/* se colocar - no começo do estilo ele será o contrário do que seria sem ele, nesse caso ao invés da direita, ele veio pro centro*/}
      </Dialog.Portal>
    </Dialog.Root>
  )
}

//O Dialog é uma funcionalidade do Radix para React 