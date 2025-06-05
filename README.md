# רשת חברתית פשוטה

רשת חברתית פשוטה ויפה שנבנתה עם HTML, CSS, JavaScript וסופבייס.

## תכונות

- 🔐 הרשמה והתחברות משתמשים
- 📝 פרסום הודעות
- ✏️ עריכת פוסטים (רק למחבר הפוסט)
- ❤️ לייקים לפוסטים
- 💬 תגובות
- 📱 עיצוב רספונסיבי
- 🎨 ממשק משתמש מודרני ויפה

## הגדרת המסד נתונים

1. היכנס לפאנל הניהול של סופבייס שלך
2. עבור ל-SQL Editor
3. העתק והדבק את התוכן מקובץ `database_setup.sql`
4. הרץ את הסקריפט

## הגדרת האפליקציה

1. פתח את קובץ `app.js`
2. וודא שה-URL וה-API Key של סופבייס נכונים (כבר מוגדרים)
3. פתח את קובץ `index.html` בדפדפן

## שימוש

### הרשמה והתחברות
- הירשם עם אימייל וסיסמה
- אשר את האימייל שלך (אם נדרש)
- התחבר עם הפרטים שלך

### פרסום תוכן
- כתוב הודעה בתיבה העליונה
- לחץ על "פרסם"
- ההודעה תופיע בפיד

### אינטראקציה
- לחץ על ❤️ כדי לתת לייק לפוסט
- לחץ על 💬 כדי לפתוח תגובות
- כתוב תגובה ולחץ "שלח"

### עריכת פוסטים
- לחץ על ✏️ בפוסט שלך כדי לערוך אותו
- ערוך את התוכן ולחץ "שמור"
- לחץ "בטל" או ESC כדי לבטל את העריכה

## קיצורי מקלדת

- `Enter` - שליחה בטפסי התחברות/הרשמה
- `Ctrl/Cmd + Enter` - פרסום פוסט חדש או שמירת עריכה
- `Enter` - שליחת תגובה
- `ESC` - ביטול עריכת פוסט

## מבנה הקבצים

```
├── index.html          # הקובץ הראשי
├── styles.css          # עיצוב האפליקציה
├── app.js             # לוגיקת האפליקציה
├── database_setup.sql  # הגדרת מסד הנתונים
└── README.md          # קובץ זה
```

## טכנולוגיות

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Supabase (PostgreSQL + Auth)
- **Styling**: CSS Grid, Flexbox, Gradients
- **Icons**: Unicode Emojis

## אבטחה

- Row Level Security (RLS) מופעל
- משתמשים יכולים לערוך רק את התוכן שלהם
- כל התוכן נראה לכולם (רשת חברתית פתוחה)

## תמיכה בדפדפנים

- Chrome/Edge 88+
- Firefox 85+
- Safari 14+

## פיתוח נוסף

רעיונות לשיפורים עתידיים:
- העלאת תמונות
- התראות
- חיפוש משתמשים
- הודעות פרטיות
- קבוצות/קהילות 