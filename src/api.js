const BASE_URL = '/api';

export async function toggleNoteArchive(id, shouldArchive) {
  try {
    const endpoint = shouldArchive ? 'archive' : 'unarchive';
    const response = await fetch(`${BASE_URL}/notes/${id}/${endpoint}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
    });
    
    if (!response.ok) {
      throw new Error(shouldArchive ? 'Gagal mengarsipkan' : 'Gagal mengembalikan');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Toggle archive error:', error);
    throw error;
  }
}

async function fetchNotes(archived = false) {
  try {
    const response = await fetch(`${BASE_URL}/notes?archived=${archived}`);
    if (!response.ok) throw new Error('Gagal memuat catatan');
    const { data } = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch notes error:', error);
    throw error;
  }
}
async function addNote({ title, body }) {
  try {
    const response = await fetch(`${BASE_URL}/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, body }),
    });
    if (!response.ok) throw new Error('Gagal menambahkan catatan');
    const { data } = await response.json();
    return data;
  } catch (error) {
    console.error('Add note error:', error);
    throw error;
  }
}

async function deleteNote(id) {
  try {
    const response = await fetch(`${BASE_URL}/notes/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Gagal menghapus catatan');
  } catch (error) {
    console.error('Delete note error:', error);
    throw error;
  }
}

async function editNote(id, { title, body }) {
  try {
    const response = await fetch(`${BASE_URL}/notes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, body }),
    });
    if (!response.ok) throw new Error('Gagal memperbarui catatan');
    return await response.json();
  } catch (error) {
    console.error('Edit note error:', error);
    throw error;
  }
}

export {
  fetchNotes,
  addNote,
  deleteNote,
  editNote,
};