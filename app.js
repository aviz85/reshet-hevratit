// Supabase configuration
const SUPABASE_URL = 'https://zgmszokuruextlhojnst.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpnbXN6b2t1cnVleHRsaG9qbnN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkxNTE1MDIsImV4cCI6MjA2NDcyNzUwMn0.JbC7AXgfhRDGNCyXWWQu2HVEVcym22kdugZmONRS2PI';

// Initialize Supabase client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Global variables
let currentUser = null;

// Function to set random placeholder
function setRandomPlaceholder() {
    const placeholders = ['איך אתה מרגיש?', 'על מה אתה חושב?', 'מה נשמע?'];
    const randomPlaceholder = placeholders[Math.floor(Math.random() * placeholders.length)];
    const postContent = document.getElementById('post-content');
    if (postContent) {
        postContent.placeholder = randomPlaceholder;
    }
}

// Initialize app
document.addEventListener('DOMContentLoaded', async () => {
    // Set random placeholder for post content
    setRandomPlaceholder();

    // Check if user is already logged in
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
        currentUser = session.user;
        showMainApp();
        await loadPosts();
    }

    // Listen for auth changes
    supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN') {
            currentUser = session.user;
            showMainApp();
            loadPosts();
        } else if (event === 'SIGNED_OUT') {
            currentUser = null;
            showAuth();
        }
    });
});

// Auth functions
function showLogin() {
    document.getElementById('login-form').style.display = 'block';
    document.getElementById('signup-form').style.display = 'none';
}

function showSignup() {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('signup-form').style.display = 'block';
}

async function login() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    if (!email || !password) {
        showMessage('אנא מלא את כל השדות', 'error');
        return;
    }

    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password
        });

        if (error) throw error;
        
        showMessage('התחברת בהצלחה!', 'success');
    } catch (error) {
        showMessage('שגיאה בהתחברות: ' + error.message, 'error');
    }
}

async function signup() {
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;

    if (!name || !email || !password) {
        showMessage('אנא מלא את כל השדות', 'error');
        return;
    }

    try {
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    full_name: name
                }
            }
        });

        if (error) throw error;
        
        showMessage('נרשמת בהצלחה! בדוק את האימייל שלך לאישור', 'success');
    } catch (error) {
        showMessage('שגיאה בהרשמה: ' + error.message, 'error');
    }
}

async function logout() {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        
        showMessage('התנתקת בהצלחה', 'success');
    } catch (error) {
        showMessage('שגיאה בהתנתקות: ' + error.message, 'error');
    }
}

// UI functions
function showAuth() {
    document.getElementById('auth-section').style.display = 'flex';
    document.getElementById('main-section').style.display = 'none';
}

function showMainApp() {
    document.getElementById('auth-section').style.display = 'none';
    document.getElementById('main-section').style.display = 'block';
    
    // Update user info
    const userName = currentUser.user_metadata?.full_name || currentUser.email;
    document.getElementById('user-name').textContent = userName;
    
    // Set random placeholder when showing main app
    setRandomPlaceholder();
}

function showMessage(message, type) {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.error, .success');
    existingMessages.forEach(msg => msg.remove());

    // Create new message
    const messageDiv = document.createElement('div');
    messageDiv.className = type;
    messageDiv.textContent = message;
    
    // Add to auth section if visible, otherwise to main section
    const authSection = document.getElementById('auth-section');
    const mainSection = document.getElementById('main-section');
    
    if (authSection.style.display !== 'none') {
        authSection.querySelector('.auth-card').insertBefore(messageDiv, authSection.querySelector('.auth-card').firstChild);
    } else {
        mainSection.insertBefore(messageDiv, mainSection.firstChild);
    }

    // Remove message after 5 seconds
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

// Posts functions
async function createPost() {
    const content = document.getElementById('post-content').value.trim();
    
    if (!content) {
        showMessage('אנא כתב משהו לפני הפרסום', 'error');
        return;
    }

    try {
        const { data, error } = await supabase
            .from('posts')
            .insert([
                {
                    content: content,
                    user_id: currentUser.id,
                    user_name: currentUser.user_metadata?.full_name || currentUser.email,
                    created_at: new Date().toISOString()
                }
            ]);

        if (error) throw error;

        document.getElementById('post-content').value = '';
        showMessage('הפוסט פורסם בהצלחה!', 'success');
        await loadPosts();
    } catch (error) {
        showMessage('שגיאה בפרסום הפוסט: ' + error.message, 'error');
    }
}

async function loadPosts() {
    try {
        const { data: posts, error } = await supabase
            .from('posts')
            .select(`
                *,
                likes (count),
                comments (*)
            `)
            .order('created_at', { ascending: false });

        if (error) throw error;

        displayPosts(posts);
    } catch (error) {
        showMessage('שגיאה בטעינת הפוסטים: ' + error.message, 'error');
    }
}

function displayPosts(posts) {
    const postsContainer = document.getElementById('posts-feed');
    
    if (!posts || posts.length === 0) {
        postsContainer.innerHTML = '<div class="loading">אין פוסטים עדיין. היה הראשון לפרסם!</div>';
        return;
    }

    postsContainer.innerHTML = posts.map(post => `
        <div class="post" data-post-id="${post.id}">
            <div class="post-header">
                <div class="post-author">${post.user_name}</div>
                <div class="post-date">${formatDate(post.created_at)}</div>
                ${post.user_id === currentUser.id ? `
                    <button class="edit-btn" onclick="toggleEditMode('${post.id}')" title="ערוך פוסט">
                        ✏️
                    </button>
                ` : ''}
            </div>
            <div class="post-content" id="post-content-${post.id}">${post.content}</div>
            <div class="post-edit-form" id="post-edit-${post.id}" style="display: none;">
                <textarea id="edit-textarea-${post.id}" class="edit-textarea">${post.content}</textarea>
                <div class="edit-actions">
                    <button onclick="savePostEdit('${post.id}')" class="save-btn">שמור</button>
                    <button onclick="cancelPostEdit('${post.id}')" class="cancel-btn">בטל</button>
                </div>
            </div>
            <div class="post-actions">
                <button class="post-action like-btn" onclick="toggleLike('${post.id}')">
                    ❤️ <span class="like-count">${post.likes?.[0]?.count || 0}</span>
                </button>
                <button class="post-action" onclick="toggleComments('${post.id}')">
                    💬 <span class="comment-count">${post.comments?.length || 0}</span>
                </button>
            </div>
            <div class="comments-section" id="comments-${post.id}" style="display: none;">
                <div class="comments-list">
                    ${post.comments?.map(comment => `
                        <div class="comment">
                            <div class="comment-author">${comment.user_name}</div>
                            <div class="comment-content">${comment.content}</div>
                        </div>
                    `).join('') || ''}
                </div>
                <div class="comment-form">
                    <input type="text" placeholder="כתוב תגובה..." id="comment-input-${post.id}">
                    <button onclick="addComment('${post.id}')">שלח</button>
                </div>
            </div>
        </div>
    `).join('');
}

async function toggleLike(postId) {
    try {
        // Check if user already liked this post
        const { data: existingLike, error: checkError } = await supabase
            .from('likes')
            .select('*')
            .eq('post_id', postId)
            .eq('user_id', currentUser.id)
            .single();

        if (checkError && checkError.code !== 'PGRST116') {
            throw checkError;
        }

        if (existingLike) {
            // Unlike
            const { error } = await supabase
                .from('likes')
                .delete()
                .eq('post_id', postId)
                .eq('user_id', currentUser.id);

            if (error) throw error;
        } else {
            // Like
            const { error } = await supabase
                .from('likes')
                .insert([
                    {
                        post_id: postId,
                        user_id: currentUser.id
                    }
                ]);

            if (error) throw error;
        }

        await loadPosts();
    } catch (error) {
        showMessage('שגיאה בעדכון הלייק: ' + error.message, 'error');
    }
}

function toggleComments(postId) {
    const commentsSection = document.getElementById(`comments-${postId}`);
    if (commentsSection.style.display === 'none') {
        commentsSection.style.display = 'block';
    } else {
        commentsSection.style.display = 'none';
    }
}

async function addComment(postId) {
    const commentInput = document.getElementById(`comment-input-${postId}`);
    const content = commentInput.value.trim();

    if (!content) {
        showMessage('אנא כתב תגובה', 'error');
        return;
    }

    try {
        const { data, error } = await supabase
            .from('comments')
            .insert([
                {
                    content: content,
                    post_id: postId,
                    user_id: currentUser.id,
                    user_name: currentUser.user_metadata?.full_name || currentUser.email,
                    created_at: new Date().toISOString()
                }
            ]);

        if (error) throw error;

        commentInput.value = '';
        await loadPosts();
    } catch (error) {
        showMessage('שגיאה בהוספת התגובה: ' + error.message, 'error');
    }
}

// Utility functions
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));

    if (diffInMinutes < 1) {
        return 'עכשיו';
    } else if (diffInMinutes < 60) {
        return `לפני ${diffInMinutes} דקות`;
    } else if (diffInMinutes < 1440) {
        const hours = Math.floor(diffInMinutes / 60);
        return `לפני ${hours} שעות`;
    } else {
        const days = Math.floor(diffInMinutes / 1440);
        return `לפני ${days} ימים`;
    }
}

// Post editing functions
function toggleEditMode(postId) {
    const postContent = document.getElementById(`post-content-${postId}`);
    const editForm = document.getElementById(`post-edit-${postId}`);
    
    if (editForm.style.display === 'none') {
        // Enter edit mode
        postContent.style.display = 'none';
        editForm.style.display = 'block';
        
        // Focus on textarea
        const textarea = document.getElementById(`edit-textarea-${postId}`);
        textarea.focus();
        textarea.setSelectionRange(textarea.value.length, textarea.value.length);
    } else {
        // Exit edit mode
        cancelPostEdit(postId);
    }
}

function cancelPostEdit(postId) {
    const postContent = document.getElementById(`post-content-${postId}`);
    const editForm = document.getElementById(`post-edit-${postId}`);
    const textarea = document.getElementById(`edit-textarea-${postId}`);
    
    // Reset textarea to original content
    const originalContent = postContent.textContent;
    textarea.value = originalContent;
    
    // Show original content, hide edit form
    postContent.style.display = 'block';
    editForm.style.display = 'none';
}

async function savePostEdit(postId) {
    const textarea = document.getElementById(`edit-textarea-${postId}`);
    const newContent = textarea.value.trim();
    
    if (!newContent) {
        showMessage('אנא כתב משהו לפני השמירה', 'error');
        return;
    }
    
    try {
        const { data, error } = await supabase
            .from('posts')
            .update({ 
                content: newContent,
                updated_at: new Date().toISOString()
            })
            .eq('id', postId)
            .eq('user_id', currentUser.id);

        if (error) throw error;

        showMessage('הפוסט עודכן בהצלחה!', 'success');
        await loadPosts();
    } catch (error) {
        showMessage('שגיאה בעדכון הפוסט: ' + error.message, 'error');
    }
}

// Allow Enter key to submit forms
document.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const activeElement = document.activeElement;
        
        if (activeElement.id === 'login-email' || activeElement.id === 'login-password') {
            login();
        } else if (activeElement.id === 'signup-name' || activeElement.id === 'signup-email' || activeElement.id === 'signup-password') {
            signup();
        } else if (activeElement.id === 'post-content') {
            if (e.ctrlKey || e.metaKey) {
                createPost();
            }
        } else if (activeElement.id && activeElement.id.startsWith('comment-input-')) {
            const postId = activeElement.id.replace('comment-input-', '');
            addComment(postId);
        } else if (activeElement.id && activeElement.id.startsWith('edit-textarea-')) {
            if (e.ctrlKey || e.metaKey) {
                const postId = activeElement.id.replace('edit-textarea-', '');
                savePostEdit(postId);
            }
        }
    }
    
    // ESC key to cancel edit
    if (e.key === 'Escape') {
        const activeElement = document.activeElement;
        if (activeElement.id && activeElement.id.startsWith('edit-textarea-')) {
            const postId = activeElement.id.replace('edit-textarea-', '');
            cancelPostEdit(postId);
        }
    }
}); 