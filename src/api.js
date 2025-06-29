const BASE_URL = '/api';

async function fetchNotes(archived = false) {
  const response = await fetch(`${BASE_URL}/notes?archived=${archived}`);
  const { data } = await response.json();
  return data;
}

async function addNote({ title, body }) {
  const response = await fetch(`${BASE_URL}/notes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, body }),
  });
  const { data } = await response.json();
  return data;
}

async function deleteNote(id) {
  await fetch(`${BASE_URL}/notes/${id}`, {
    method: 'DELETE',
  });
}
async function editNote(id, { title, body }) {
  const response = await fetch(`${BASE_URL}/notes/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title, body }),
  });
  if (!response.ok) throw new Error('Gagal memperbarui catatan');
  
  return await response.json();
}


async function archiveNote(id) {
  const response = await fetch(`${BASE_URL}/notes/${id}/archive`, {
    method: 'POST',
  });
  if (!response.ok) throw new Error('Gagal mengarsipkan');
  return await response.json();
}

async function unarchiveNote(id) {
  const response = await fetch(`${BASE_URL}/notes/${id}/unarchive`, {
    method: 'POST',
  });
  if (!response.ok) throw new Error('Gagal mengembalikan');
  return await response.json();
}

export { fetchNotes, addNote, deleteNote, archiveNote, unarchiveNote, editNote };
