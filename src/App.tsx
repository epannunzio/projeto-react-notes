import { ChangeEvent, useState } from 'react';
import logo from './assets/logo-expert-notes.svg';
import { NewNoteCard } from './components/new-note-card';
import { NoteCard } from './components/note-card';

interface Note { //formato que preciso da array
  id: string
  date: Date
  content: string
}

export function App() {
  const [search, setSearch] = useState('')
  const [notes, setNotes] = useState<Note[]>(() => { //um estado com um array, informando em <Note[]> qual é o formato que eu preciso da array
  const notesOnStorage = localStorage.getItem('notes')

    if (notesOnStorage) {
      return JSON.parse(notesOnStorage) //faz com que as notas salvas não sumam com F5
    }

    return []
  }) 

  function onNoteCreated(content: string) {
    const newNote = {
      id: crypto.randomUUID(), //gera ID único universal em formato string
      date: new Date(),
      content,
    }

    const notesArray = [newNote, ...notes] //com o newNote no começo do array elas vão sendo criadas por ordem crescente
    setNotes(notesArray) 
    localStorage.setItem('notes', JSON.stringify(notesArray)) //localstorage não aceita array, por isso usamos o JSON que converte array em texto

    //JSON = javascript object notation
  }

  function onNoteDeleted(id: string) {
    const notesArray = notes.filter(note => {
      return note.id !== id
    }) 

    setNotes(notesArray)
    localStorage.setItem('notes', JSON.stringify(notesArray))
  }

  function handleSearch(event: ChangeEvent<HTMLInputElement>) {
    const query = event.target.value 

    setSearch(query)
  }

  const filteredNotes = search !== ''    //essa constante faz a barra de busca já exibir em tela oque digitar na busca
    ? notes.filter(note => note.content.toLocaleLowerCase().includes(search.toLocaleLowerCase())) //assim a busca não fica case sensitive e mostra a busca seja letra maiuscula ou minuscula
    : notes

  return (
    <div className='mx-auto max-w-6xl my-12 space-y-6 px-5 md:px-0'> {/* MD: é para responsividade */}
      <img src={logo} alt='NLW Expert'/>

      <form className='w-full'>
        <input
          type='text'
          placeholder='Busque em suas notas...' 
          className='w-full bg-transparent text-3xl font-semibold tracking-tight outline-none placeholder:text-slate-500'
          onChange={handleSearch}
        />
      </form>

      <div className='h-px bg-slate-700' />

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[250px]'> { /* valores que não são do tailwind vão entre colchetes */ }
        <NewNoteCard onNoteCreated={onNoteCreated} /> 

        {filteredNotes.map(note => {
          return <NoteCard key={note.id} note={note} onNoteDeleted={onNoteDeleted} /> //como temos um estado, com essa chamada teremos outras notas na tela
        })}      
      </div>
    </div>
  )
}

//export default App
