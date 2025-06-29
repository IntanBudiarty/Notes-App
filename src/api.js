const BASE_URL = '/api';

export async function toggleNoteArchive(id, shouldArchive) {
  try {
    const endpoint = shouldArchive ? 'archive' : 'unarchive';
    const response = await fetch(`${BASE_URL}/notes/${id}/${endpoint}`, {
      method: 'POST', // Dicoding API uses POST for archive/unarchive
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}` // Add if needed
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || (shouldArchive ? 'Gagal mengarsipkan' : 'Gagal mengembalikan'));
    }
    
    return await response.json();
  } catch (error) {
    console.error('Toggle archive error:', error);
    throw error;
  }
}

// Updated fetchNotes to match Dicoding API
export async function fetchNotes(archived = false) {
  try {
    const endpoint = archived ? 'notes/archived' : 'notes';
    const response = await fetch(`${BASE_URL}/${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}` // Add if needed
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Gagal memuat catatan');
    }
    
    const { data } = await response.json();
    return data.notes || data; // Handle different response formats
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
  addNote,
  deleteNote,
  editNote,
};