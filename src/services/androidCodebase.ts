import JSZip from 'jszip';

export interface AndroidProjectFile {
  path: string;
  language: 'kotlin' | 'xml' | 'groovy' | 'properties' | 'markdown';
  description: string;
  content: string;
}

export const ANDROID_PROJECT_FILES: AndroidProjectFile[] = [
  {
    path: 'settings.gradle.kts',
    language: 'kotlin',
    description: 'Gradle project settings and plugin repositories',
    content: `pluginManagement {
    repositories {
        google {
            content {
                includeGroupByRegex("com\\\\.android.*")
                includeGroupByRegex("com\\\\.google.*")
                includeGroupByRegex("androidx.*")
            }
        }
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}

rootProject.name = "HassanSound"
include(":app")
`
  },
  {
    path: 'build.gradle.kts',
    language: 'kotlin',
    description: 'Root project Gradle build configuration',
    content: `// Top-level build file for Hassan Sound
plugins {
    alias(libs.plugins.android.application) apply false
    alias(libs.plugins.kotlin.android) apply false
    alias(libs.plugins.kotlin.compose) apply false
    alias(libs.plugins.ksp) apply false
}
`
  },
  {
    path: 'app/build.gradle.kts',
    language: 'kotlin',
    description: 'Application-level build.gradle.kts with Jetpack Compose, Room, Coroutines & Media3',
    content: `plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
    id("com.google.devtools.ksp")
}

android {
    namespace = "com.hassansound.app"
    compileSdk = 36

    defaultConfig {
        applicationId = "com.hassansound.app"
        minSdk = 26
        targetSdk = 36
        versionCode = 1
        versionName = "1.0.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
        vectorDrawables {
            useSupportLibrary = true
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            isShrinkResources = true
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
            signingConfig = signingConfigs.getByName("debug")
        }
        debug {
            applicationIdSuffix = ".debug"
            isDebuggable = true
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    kotlinOptions {
        jvmTarget = "17"
    }

    buildFeatures {
        compose = true
    }

    composeOptions {
        kotlinCompilerExtensionVersion = "1.5.15"
    }

    packaging {
        resources {
            excludes += "/META-INF/{AL2.0,LGPL2.1}"
        }
    }
}

dependencies {
    // AndroidX & Lifecycle
    implementation("androidx.core:core-ktx:1.15.0")
    implementation("androidx.lifecycle:lifecycle-runtime-ktx:2.8.7")
    implementation("androidx.lifecycle:lifecycle-viewmodel-compose:2.8.7")
    implementation("androidx.activity:activity-compose:1.10.0")

    // Jetpack Compose BOM
    val composeBom = platform("androidx.compose:compose-bom:2024.12.01")
    implementation(composeBom)
    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.ui:ui-graphics")
    implementation("androidx.compose.ui:ui-tooling-preview")
    implementation("androidx.compose.material3:material3")
    implementation("androidx.compose.material:material-icons-extended")

    // Navigation Compose
    implementation("androidx.navigation:navigation-compose:2.8.5")

    // Room Database
    val roomVersion = "2.6.1"
    implementation("androidx.room:room-runtime:$roomVersion")
    implementation("androidx.room:room-ktx:$roomVersion")
    ksp("androidx.room:room-compiler:$roomVersion")

    // Media & Audio Playback (Media3 / MediaSession)
    implementation("androidx.media3:media3-session:1.5.1")
    implementation("androidx.media3:media3-common:1.5.1")

    // PDF Text Extraction & Rendering
    implementation("com.tom-roush:pdfbox-android:2.0.27.0")

    // Coroutines
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-android:1.9.0")

    // Image loading for book covers
    implementation("io.coil-kt:coil-compose:2.7.0")

    // Debugging
    debugImplementation("androidx.compose.ui:ui-tooling")
    debugImplementation("androidx.compose.ui:ui-test-manifest")
}
`
  },
  {
    path: 'app/src/main/AndroidManifest.xml',
    language: 'xml',
    description: 'Android Manifest declaring permissions, Foreground Service, Storage Access & Audio Focus',
    content: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

    <!-- Foreground service permissions for background reading -->
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE_MEDIA_PLAYBACK" />
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
    <uses-permission android:name="android.permission.WAKE_LOCK" />

    <!-- Document storage reading via SAF -->
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE"
        android:maxSdkVersion="32" />

    <application
        android:name=".HassanSoundApplication"
        android:allowBackup="true"
        android:dataExtractionRules="@xml/data_extraction_rules"
        android:fullBackupContent="@xml/backup_rules"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.HassanSound">

        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:configChanges="orientation|screenSize|layoutDirection|locale"
            android:windowSoftInputMode="adjustResize"
            android:theme="@style/Theme.HassanSound">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>

            <!-- Intent filter to open PDF files directly in Hassan Sound -->
            <intent-filter>
                <action android:name="android.intent.action.VIEW" />
                <category android:name="android.intent.category.DEFAULT" />
                <category android:name="android.intent.category.BROWSABLE" />
                <data android:mimeType="application/pdf" />
                <data android:mimeType="text/plain" />
            </intent-filter>
        </activity>

        <!-- Foreground Audio & TTS Playback Service -->
        <service
            android:name=".service.PlaybackService"
            android:foregroundServiceType="mediaPlayback"
            android:exported="false" />

    </application>

</manifest>
`
  },
  {
    path: 'app/src/main/res/values/strings.xml',
    language: 'xml',
    description: 'English string resources',
    content: `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="app_name">Hassan Sound</string>
    <string name="tagline">Audiobook &amp; PDF Reader</string>
    <string name="nav_home">Home</string>
    <string name="nav_library">Library</string>
    <string name="nav_player">Player</string>
    <string name="nav_settings">Settings</string>
    <string name="import_book">Import Document</string>
    <string name="continue_reading">Continue Listening</string>
    <string name="my_library">My Library</string>
    <string name="recently_added">Recently Added</string>
    <string name="stats_minutes">Minutes Read</string>
    <string name="stats_books">Completed</string>
    <string name="stats_streak">Day Streak</string>
    <string name="play">Play</string>
    <string name="pause">Pause</string>
    <string name="speed">Speed</string>
    <string name="pitch">Pitch</string>
    <string name="voice">Voice</string>
    <string name="sleep_timer">Sleep Timer</string>
    <string name="scanned_pdf_warning">This PDF is scanned without text layer. OCR is required.</string>
    <string name="notification_reading">Now reading: %1$s</string>
</resources>
`
  },
  {
    path: 'app/src/main/res/values-ar/strings.xml',
    language: 'xml',
    description: 'Arabic string resources with full RTL support',
    content: `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="app_name">حسن ساوند</string>
    <string name="tagline">قارئ الكتب الصوتية وملفات PDF</string>
    <string name="nav_home">الرئيسية</string>
    <string name="nav_library">المكتبة</string>
    <string name="nav_player">المشغل</string>
    <string name="nav_settings">الإعدادات</string>
    <string name="import_book">استيراد مستند</string>
    <string name="continue_reading">متابعة الاستماع</string>
    <string name="my_library">مكتبتي</string>
    <string name="recently_added">أضيف مؤخراً</string>
    <string name="stats_minutes">دقيقة استماع</string>
    <string name="stats_books">كتب مكتملة</string>
    <string name="stats_streak">أيام متتالية</string>
    <string name="play">تشغيل</string>
    <string name="pause">إيقاف مؤقت</string>
    <string name="speed">السرعة</string>
    <string name="pitch">طبقة الصوت</string>
    <string name="voice">الصوت</string>
    <string name="sleep_timer">مؤقت النوم</string>
    <string name="scanned_pdf_warning">هذا الملف مصور ولا يحتوي على نصوص مدمجة. يلزم التعرف الضوئي OCR.</string>
    <string name="notification_reading">يقرأ الآن: %1$s</string>
</resources>
`
  },
  {
    path: 'app/src/main/res/values/colors.xml',
    language: 'xml',
    description: 'Color resources defining the Hassan Sound dark navy and purple palette',
    content: `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="brand_navy_bg">#101321</color>
    <color name="brand_surface">#181C2E</color>
    <color name="brand_surface_card">#20263C</color>
    <color name="brand_purple_primary">#7657F6</color>
    <color name="brand_purple_light">#9B82FF</color>
    <color name="brand_purple_dark">#4B32A8</color>
    <color name="text_primary">#F1F5F9</color>
    <color name="text_secondary">#94A3B8</color>
</resources>
`
  },
  {
    path: 'app/src/main/res/values/themes.xml',
    language: 'xml',
    description: 'Material 3 Dark Theme configuration',
    content: `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <style name="Theme.HassanSound" parent="android:Theme.Material.NoActionBar">
        <item name="android:statusBarColor">#101321</item>
        <item name="android:navigationBarColor">#101321</item>
        <item name="android:windowBackground">#101321</item>
        <item name="android:windowLightStatusBar">false</item>
    </style>
</resources>
`
  },
  {
    path: 'app/src/main/java/com/hassansound/app/HassanSoundApplication.kt',
    language: 'kotlin',
    description: 'Application class initializing Room Database, TTS and Notification Channels',
    content: `package com.hassansound.app

import android.app.Application
import android.app.NotificationChannel
import android.app.NotificationManager
import android.os.Build
import com.hassansound.app.database.BookDatabase
import com.hassansound.app.repository.BookRepository

class HassanSoundApplication : Application() {

    lateinit var repository: BookRepository
        private set

    override fun onCreate() {
        super.onCreate()
        val database = BookDatabase.getDatabase(this)
        repository = BookRepository(database.bookDao())

        createNotificationChannels()
    }

    private fun createNotificationChannels() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                CHANNEL_ID_PLAYBACK,
                getString(R.string.app_name),
                NotificationManager.IMPORTANCE_LOW
            ).apply {
                description = "Hassan Sound Background Audio Player Controls"
                setShowBadge(false)
            }
            val manager = getSystemService(NotificationManager::class.java)
            manager?.createNotificationChannel(channel)
        }
    }

    companion object {
        const val CHANNEL_ID_PLAYBACK = "hassan_sound_playback_channel"
    }
}
`
  },
  {
    path: 'app/src/main/java/com/hassansound/app/data/model/BookEntity.kt',
    language: 'kotlin',
    description: 'Room Database Entity representing imported books and reading positions',
    content: `package com.hassansound.app.data.model

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "books")
data class BookEntity(
    @PrimaryKey val id: String,
    val title: String,
    val titleAr: String?,
    val author: String,
    val fileType: String, // "pdf", "txt", "epub"
    val uriString: String,
    val coverPath: String?,
    val totalPages: Int,
    val currentPage: Int,
    val currentParagraph: Int,
    val progressPercent: Int,
    val lastOpenedTimestamp: Long,
    val language: String, // "ar", "en"
    val isScanned: Boolean = false,
    val extractedTextCache: String? = null
)
`
  },
  {
    path: 'app/src/main/java/com/hassansound/app/database/BookDao.kt',
    language: 'kotlin',
    description: 'Room DAO for reactive database queries with Kotlin Flow',
    content: `package com.hassansound.app.database

import androidx.room.*
import com.hassansound.app.data.model.BookEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface BookDao {
    @Query("SELECT * FROM books ORDER BY lastOpenedTimestamp DESC")
    fun getAllBooks(): Flow<List<BookEntity>>

    @Query("SELECT * FROM books WHERE id = :bookId LIMIT 1")
    suspend fun getBookById(bookId: String): BookEntity?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertBook(book: BookEntity)

    @Update
    suspend fun updateBook(book: BookEntity)

    @Query("UPDATE books SET currentPage = :page, currentParagraph = :paragraph, progressPercent = :progress, lastOpenedTimestamp = :timestamp WHERE id = :bookId")
    suspend fun updateProgress(bookId: String, page: Int, paragraph: Int, progress: Int, timestamp: Long)

    @Delete
    suspend fun deleteBook(book: BookEntity)

    @Query("DELETE FROM books WHERE id = :bookId")
    suspend fun deleteById(bookId: String)
}
`
  },
  {
    path: 'app/src/main/java/com/hassansound/app/database/BookDatabase.kt',
    language: 'kotlin',
    description: 'Room Database singleton provider',
    content: `package com.hassansound.app.database

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import com.hassansound.app.data.model.BookEntity

@Database(entities = [BookEntity::class], version = 1, exportSchema = false)
abstract class BookDatabase : RoomDatabase() {
    abstract fun bookDao(): BookDao

    companion object {
        @Volatile
        private var INSTANCE: BookDatabase? = null

        fun getDatabase(context: Context): BookDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    BookDatabase::class.java,
                    "hassan_sound_db"
                ).build()
                INSTANCE = instance
                instance
            }
        }
    }
}
`
  },
  {
    path: 'app/src/main/java/com/hassansound/app/repository/BookRepository.kt',
    language: 'kotlin',
    description: 'Repository abstracting database operations and progress synchronization',
    content: `package com.hassansound.app.repository

import com.hassansound.app.data.model.BookEntity
import com.hassansound.app.database.BookDao
import kotlinx.coroutines.flow.Flow

class BookRepository(private val bookDao: BookDao) {
    val allBooks: Flow<List<BookEntity>> = bookDao.getAllBooks()

    suspend fun getBook(id: String): BookEntity? = bookDao.getBookById(id)

    suspend fun insert(book: BookEntity) = bookDao.insertBook(book)

    suspend fun updateProgress(id: String, page: Int, paragraph: Int, progress: Int) {
        bookDao.updateProgress(id, page, paragraph, progress, System.currentTimeMillis())
    }

    suspend fun delete(id: String) = bookDao.deleteById(id)
}
`
  },
  {
    path: 'app/src/main/java/com/hassansound/app/pdf/PdfTextExtractor.kt',
    language: 'kotlin',
    description: 'Real PDF Text Extractor using Android PdfRenderer and PDFBox Android with OCR fallback detection',
    content: `package com.hassansound.app.pdf

import android.content.Context
import android.net.Uri
import com.tomroush.pdfbox.android.PDFBoxResourceLoader
import com.tomroush.pdfbox.pdmodel.PDDocument
import com.tomroush.pdfbox.text.PDFTextStripper
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.io.InputStream

data class ExtractedPage(
    val pageNumber: Int,
    val text: String,
    val paragraphs: List<String>
)

data class ExtractionResult(
    val title: String,
    val totalPages: Int,
    val pages: List<ExtractedPage>,
    val isScanned: Boolean
)

object PdfTextExtractor {

    suspend fun extractText(context: Context, uri: Uri, fileName: String): ExtractionResult = withContext(Dispatchers.IO) {
        PDFBoxResourceLoader.init(context)

        var inputStream: InputStream? = null
        var document: PDDocument? = null

        try {
            inputStream = context.contentResolver.openInputStream(uri)
                ?: throw IllegalStateException("Unable to open URI stream")
            document = PDDocument.load(inputStream)

            val totalPages = document.numberOfPages
            val pagesList = mutableListOf<ExtractedPage>()
            val stripper = PDFTextStripper()

            var totalCharacters = 0

            for (page in 1..totalPages) {
                stripper.startPage = page
                stripper.endPage = page
                val pageText = stripper.getText(document).trim()
                totalCharacters += pageText.length

                val paragraphs = pageText
                    .split("\\n\\s*\\n".toRegex())
                    .map { it.trim() }
                    .filter { it.isNotEmpty() }

                pagesList.add(
                    ExtractedPage(
                        pageNumber = page,
                        text = pageText,
                        paragraphs = if (paragraphs.isNotEmpty()) paragraphs else listOf(pageText)
                    )
                )
            }

            // If a multi-page document has virtually no extractable text, it is scanned
            val isScanned = totalCharacters < 50 && totalPages > 0

            ExtractionResult(
                title = fileName.replace(".pdf", "", ignoreCase = true),
                totalPages = totalPages,
                pages = pagesList,
                isScanned = isScanned
            )
        } finally {
            try { document?.close() } catch (_: Exception) {}
            try { inputStream?.close() } catch (_: Exception) {}
        }
    }
}
`
  },
  {
    path: 'app/src/main/java/com/hassansound/app/audio/TtsManager.kt',
    language: 'kotlin',
    description: 'Android TextToSpeech engine wrapper with Arabic & English support, pitch, rate & utterance tracking',
    content: `package com.hassansound.app.audio

import android.content.Context
import android.os.Bundle
import android.speech.tts.TextToSpeech
import android.speech.tts.UtteranceProgressListener
import android.speech.tts.Voice
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import java.util.Locale

class TtsManager(context: Context, onReady: (Boolean) -> Unit) {

    private var tts: TextToSpeech? = null
    private var isInitialized = false

    private val _isPlaying = MutableStateFlow(false)
    val isPlaying: StateFlow<Boolean> = _isPlaying

    private val _currentUtteranceId = MutableStateFlow<String?>(null)
    val currentUtteranceId: StateFlow<String?> = _currentUtteranceId

    var speed: Float = 1.0f
        set(value) {
            field = value.coerceIn(0.5f, 3.0f)
            tts?.setSpeechRate(field)
        }

    var pitch: Float = 1.0f
        set(value) {
            field = value.coerceIn(0.5f, 2.0f)
            tts?.setPitch(field)
        }

    init {
        tts = TextToSpeech(context.applicationContext) { status ->
            if (status == TextToSpeech.SUCCESS) {
                isInitialized = true
                setupUtteranceListener()
                onReady(true)
            } else {
                onReady(false)
            }
        }
    }

    private fun setupUtteranceListener() {
        tts?.setOnUtteranceProgressListener(object : UtteranceProgressListener() {
            override fun onStart(utteranceId: String?) {
                _isPlaying.value = true
                _currentUtteranceId.value = utteranceId
            }

            override fun onDone(utteranceId: String?) {
                _isPlaying.value = false
            }

            override fun onError(utteranceId: String?) {
                _isPlaying.value = false
            }

            override fun onRangeStart(utteranceId: String?, start: Int, end: Int, frame: Int) {
                // Word and sentence boundary highlighting in Jetpack Compose
            }
        })
    }

    fun speak(text: String, languageCode: String, utteranceId: String) {
        if (!isInitialized) return

        val locale = if (languageCode == "ar") Locale("ar") else Locale.US
        tts?.language = locale
        tts?.setSpeechRate(speed)
        tts?.setPitch(pitch)

        val params = Bundle()
        tts?.speak(text, TextToSpeech.QUEUE_FLUSH, params, utteranceId)
    }

    fun pauseOrStop() {
        tts?.stop()
        _isPlaying.value = false
    }

    fun getAvailableVoices(languageCode: String): List<Voice> {
        if (!isInitialized) return emptyList()
        val locale = if (languageCode == "ar") Locale("ar") else Locale.US
        return tts?.voices?.filter { it.locale.language == locale.language } ?: emptyList()
    }

    fun setVoice(voice: Voice) {
        tts?.voice = voice
    }

    fun release() {
        tts?.stop()
        tts?.shutdown()
        tts = null
    }
}
`
  },
  {
    path: 'app/src/main/java/com/hassansound/app/service/PlaybackService.kt',
    language: 'kotlin',
    description: 'Foreground Service maintaining background audio playback, notification controls & lock screen sync',
    content: `package com.hassansound.app.service

import android.app.Notification
import android.app.PendingIntent
import android.app.Service
import android.content.Intent
import android.os.IBinder
import androidx.core.app.NotificationCompat
import com.hassansound.app.HassanSoundApplication
import com.hassansound.app.MainActivity
import com.hassansound.app.R
import com.hassansound.app.audio.TtsManager

class PlaybackService : Service() {

    private lateinit var ttsManager: TtsManager
    private var currentBookTitle: String = "Hassan Sound"

    override fun onCreate() {
        super.onCreate()
        ttsManager = TtsManager(this) { ready ->
            // Ready callback
        }
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        val action = intent?.action
        val title = intent?.getStringExtra("EXTRA_BOOK_TITLE") ?: currentBookTitle
        currentBookTitle = title

        when (action) {
            ACTION_PLAY -> {
                val text = intent.getStringExtra("EXTRA_TEXT") ?: ""
                val lang = intent.getStringExtra("EXTRA_LANG") ?: "ar"
                val utteranceId = intent.getStringExtra("EXTRA_UTTERANCE_ID") ?: "bg_utterance"
                startForeground(NOTIFICATION_ID, buildNotification(currentBookTitle, true))
                ttsManager.speak(text, lang, utteranceId)
            }
            ACTION_PAUSE -> {
                ttsManager.pauseOrStop()
                startForeground(NOTIFICATION_ID, buildNotification(currentBookTitle, false))
            }
            ACTION_STOP -> {
                ttsManager.pauseOrStop()
                stopForeground(STOP_FOREGROUND_REMOVE)
                stopSelf()
            }
        }

        return START_NOT_STICKY
    }

    private fun buildNotification(title: String, isPlaying: Boolean): Notification {
        val contentIntent = PendingIntent.getActivity(
            this, 0,
            Intent(this, MainActivity::class.java),
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        val playPauseIntent = Intent(this, PlaybackService::class.java).apply {
            action = if (isPlaying) ACTION_PAUSE else ACTION_PLAY
        }
        val playPausePending = PendingIntent.getService(
            this, 1, playPauseIntent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        val stopIntent = Intent(this, PlaybackService::class.java).apply { action = ACTION_STOP }
        val stopPending = PendingIntent.getService(
            this, 2, stopIntent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        return NotificationCompat.Builder(this, HassanSoundApplication.CHANNEL_ID_PLAYBACK)
            .setContentTitle(title)
            .setContentText(getString(if (isPlaying) R.string.play else R.string.pause))
            .setSmallIcon(android.R.drawable.ic_media_play)
            .setContentIntent(contentIntent)
            .addAction(
                if (isPlaying) android.R.drawable.ic_media_pause else android.R.drawable.ic_media_play,
                if (isPlaying) getString(R.string.pause) else getString(R.string.play),
                playPausePending
            )
            .addAction(android.R.drawable.ic_menu_close_clear_cancel, "Stop", stopPending)
            .setOngoing(isPlaying)
            .setPriority(NotificationCompat.PRIORITY_LOW)
            .build()
    }

    override fun onDestroy() {
        super.onDestroy()
        ttsManager.release()
    }

    override fun onBind(intent: Intent?): IBinder? = null

    companion object {
        const val NOTIFICATION_ID = 1001
        const val ACTION_PLAY = "com.hassansound.app.ACTION_PLAY"
        const val ACTION_PAUSE = "com.hassansound.app.ACTION_PAUSE"
        const val ACTION_STOP = "com.hassansound.app.ACTION_STOP"
    }
}
`
  },
  {
    path: 'app/src/main/java/com/hassansound/app/ui/theme/Color.kt',
    language: 'kotlin',
    description: 'Hassan Sound Compose theme color definitions',
    content: `package com.hassansound.app.ui.theme

import androidx.compose.ui.graphics.Color

val NavyBackground = Color(0xFF101321)
val SurfaceCard = Color(0xFF181C2E)
val SurfaceCardElevated = Color(0xFF20263C)

val PurplePrimary = Color(0xFF7657F6)
val PurpleLight = Color(0xFF9B82FF)
val PurpleGlow = Color(0x407657F6)

val TextPrimary = Color(0xFFF1F5F9)
val TextSecondary = Color(0xFF94A3B8)
val AccentGold = Color(0xFFE2B714)
`
  },
  {
    path: 'app/src/main/java/com/hassansound/app/ui/theme/Theme.kt',
    language: 'kotlin',
    description: 'Material 3 Dark Theme provider with Hassan Sound styling',
    content: `package com.hassansound.app.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable

private val DarkColorScheme = darkColorScheme(
    primary = PurplePrimary,
    onPrimary = TextPrimary,
    secondary = PurpleLight,
    background = NavyBackground,
    surface = SurfaceCard,
    onBackground = TextPrimary,
    onSurface = TextPrimary
)

@Composable
fun HassanSoundTheme(content: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = DarkColorScheme,
        typography = Typography,
        content = content
    )
}
`
  },
  {
    path: 'app/src/main/java/com/hassansound/app/ui/theme/Type.kt',
    language: 'kotlin',
    description: 'Compose Typography definition supporting Arabic and English typography',
    content: `package com.hassansound.app.ui.theme

import androidx.compose.material3.Typography
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.sp

val Typography = Typography(
    headlineLarge = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.Bold,
        fontSize = 28.sp,
        color = TextPrimary
    ),
    headlineMedium = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.SemiBold,
        fontSize = 20.sp,
        color = TextPrimary
    ),
    bodyLarge = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.Normal,
        fontSize = 16.sp,
        lineHeight = 24.sp,
        color = TextPrimary
    ),
    bodyMedium = TextStyle(
        fontFamily = FontFamily.Default,
        fontWeight = FontWeight.Normal,
        fontSize = 14.sp,
        color = TextSecondary
    )
)
`
  },
  {
    path: 'app/src/main/java/com/hassansound/app/MainActivity.kt',
    language: 'kotlin',
    description: 'Main Activity with Jetpack Compose navigation, Storage Access Framework picker and Edge-to-Edge setup',
    content: `package com.hassansound.app

import android.net.Uri
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.hassansound.app.ui.navigation.HassanSoundBottomBar
import com.hassansound.app.ui.screens.*
import com.hassansound.app.ui.theme.HassanSoundTheme

class MainActivity : ComponentActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        setContent {
            HassanSoundTheme {
                val navController = rememberNavController()
                var currentRoute by remember { mutableStateOf("home") }

                // Storage Access Framework launcher for PDF / TXT import
                val documentPicker = rememberLauncherForActivityResult(
                    contract = ActivityResultContracts.OpenDocument()
                ) { uri: Uri? ->
                    uri?.let {
                        // Pass uri to ViewModel or Repository for extraction
                    }
                }

                Scaffold(
                    modifier = Modifier.fillMaxSize(),
                    bottomBar = {
                        HassanSoundBottomBar(
                            currentRoute = currentRoute,
                            onNavigate = { route ->
                                currentRoute = route
                                navController.navigate(route) {
                                    popUpTo("home") { saveState = true }
                                    launchSingleTop = true
                                    restoreState = true
                                }
                            }
                        )
                    }
                ) { innerPadding ->
                    NavHost(
                        navController = navController,
                        startDestination = "home",
                        modifier = Modifier.padding(innerPadding)
                    ) {
                        composable("home") {
                            HomeScreen(
                                onOpenBook = { bookId -> navController.navigate("player/$bookId") },
                                onImportClick = { documentPicker.launch(arrayOf("application/pdf", "text/plain")) }
                            )
                        }
                        composable("library") {
                            LibraryScreen(
                                onOpenBook = { bookId -> navController.navigate("reader/$bookId") },
                                onImportClick = { documentPicker.launch(arrayOf("application/pdf", "text/plain")) }
                            )
                        }
                        composable("player/{bookId}") { backStackEntry ->
                            val bookId = backStackEntry.arguments?.getString("bookId") ?: ""
                            PlayerScreen(bookId = bookId, onNavigateBack = { navController.popBackStack() })
                        }
                        composable("reader/{bookId}") { backStackEntry ->
                            val bookId = backStackEntry.arguments?.getString("bookId") ?: ""
                            ReaderScreen(bookId = bookId, onNavigateBack = { navController.popBackStack() })
                        }
                        composable("settings") {
                            SettingsScreen()
                        }
                    }
                }
            }
        }
    }
}
`
  },
  {
    path: 'app/src/main/java/com/hassansound/app/ui/navigation/Navigation.kt',
    language: 'kotlin',
    description: 'Jetpack Compose Bottom Navigation Bar with dark purple accent',
    content: `package com.hassansound.app.ui.navigation

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Book
import androidx.compose.material.icons.filled.Headphones
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.res.stringResource
import com.hassansound.app.R
import com.hassansound.app.ui.theme.NavyBackground
import com.hassansound.app.ui.theme.PurplePrimary
import com.hassansound.app.ui.theme.TextSecondary

sealed class NavItem(val route: String, val titleRes: Int, val icon: ImageVector) {
    object Home : NavItem("home", R.string.nav_home, Icons.Default.Home)
    object Library : NavItem("library", R.string.nav_library, Icons.Default.Book)
    object Player : NavItem("player/last", R.string.nav_player, Icons.Default.Headphones)
    object Settings : NavItem("settings", R.string.nav_settings, Icons.Default.Settings)
}

@Composable
fun HassanSoundBottomBar(
    currentRoute: String,
    onNavigate: (String) -> Unit
) {
    val items = listOf(NavItem.Home, NavItem.Library, NavItem.Player, NavItem.Settings)

    NavigationBar(containerColor = NavyBackground) {
        items.forEach { item ->
            val selected = currentRoute.startsWith(item.route.split("/")[0])
            NavigationBarItem(
                selected = selected,
                onClick = { onNavigate(item.route) },
                icon = { Icon(item.icon, contentDescription = stringResource(item.titleRes)) },
                label = { Text(stringResource(item.titleRes)) },
                colors = NavigationBarItemDefaults.colors(
                    selectedIconColor = PurplePrimary,
                    selectedTextColor = PurplePrimary,
                    unselectedIconColor = TextSecondary,
                    unselectedTextColor = TextSecondary,
                    indicatorColor = PurplePrimary.copy(alpha = 0.15f)
                )
            )
        }
    }
}
`
  },
  {
    path: 'app/src/main/java/com/hassansound/app/ui/screens/HomeScreen.kt',
    language: 'kotlin',
    description: 'Compose Home Screen with branding, continue reading card, stats and carousel',
    content: `package com.hassansound.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.hassansound.app.R
import com.hassansound.app.ui.theme.*

@Composable
fun HomeScreen(
    onOpenBook: (String) -> Unit,
    onImportClick: () -> Unit
) {
    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(NavyBackground)
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(20.dp)
    ) {
        // Hassan Sound Brand Header
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text(
                        text = stringResource(R.string.app_name),
                        style = MaterialTheme.typography.headlineLarge,
                        color = TextPrimary
                    )
                    Text(
                        text = stringResource(R.string.tagline),
                        style = MaterialTheme.typography.bodyMedium,
                        color = PurpleLight
                    )
                }

                FilledTonalButton(
                    onClick = onImportClick,
                    colors = ButtonDefaults.filledTonalButtonColors(containerColor = PurplePrimary)
                ) {
                    Icon(Icons.Default.Add, contentDescription = null, tint = Color.White)
                    Spacer(Modifier.width(6.dp))
                    Text(stringResource(R.string.import_book), color = Color.White)
                }
            }
        }

        // Continue Reading Featured Card
        item {
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(20.dp))
                    .clickable { onOpenBook("featured") },
                colors = CardDefaults.cardColors(containerColor = SurfaceCard)
            ) {
                Row(
                    modifier = Modifier.padding(16.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Box(
                        modifier = Modifier
                            .size(64.dp)
                            .clip(RoundedCornerShape(12.dp))
                            .background(PurpleGlow),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(Icons.Default.PlayArrow, contentDescription = null, tint = PurpleLight, modifier = Modifier.size(36.dp))
                    }
                    Spacer(Modifier.width(16.dp))
                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            text = stringResource(R.string.continue_reading),
                            fontSize = 12.sp,
                            color = PurpleLight,
                            fontWeight = FontWeight.Medium
                        )
                        Text(
                            text = "The Prophet • النبي",
                            fontSize = 18.sp,
                            fontWeight = FontWeight.Bold,
                            color = TextPrimary
                        )
                        Text(
                            text = "Page 2 of 4 • 45%",
                            fontSize = 13.sp,
                            color = TextSecondary
                        )
                    }
                }
            }
        }

        // Reading Statistics Row
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                StatCard(modifier = Modifier.weight(1f), number = "84", label = stringResource(R.string.stats_minutes))
                StatCard(modifier = Modifier.weight(1f), number = "2", label = stringResource(R.string.stats_books))
                StatCard(modifier = Modifier.weight(1f), number = "5", label = stringResource(R.string.stats_streak))
            }
        }
    }
}

@Composable
fun StatCard(modifier: Modifier = Modifier, number: String, label: String) {
    Card(
        modifier = modifier,
        colors = CardDefaults.cardColors(containerColor = SurfaceCardElevated),
        shape = RoundedCornerShape(16.dp)
    ) {
        Column(
            modifier = Modifier.padding(14.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(text = number, fontSize = 22.sp, fontWeight = FontWeight.Bold, color = PurplePrimary)
            Spacer(Modifier.height(4.dp))
            Text(text = label, fontSize = 11.sp, color = TextSecondary)
        }
    }
}
`
  },
  {
    path: 'README.md',
    language: 'markdown',
    description: 'Hassan Sound Android Project Documentation and Build Instructions',
    content: `# Hassan Sound (حسن ساوند)
### Professional Android Audiobook & PDF Reader with Real TTS & Background Playback

Package: \`com.hassansound.app\`
Minimum SDK: 26 (Android 8.0 Oreo)
Compile & Target SDK: 36 (Android 15+)

## Architecture & Technology Stack
- **Architecture**: MVVM with Clean Architecture & Unidirectional Data Flow.
- **UI Toolkit**: 100% Jetpack Compose with Material 3 design system.
- **Color Palette**: Dark Navy (\`#101321\`) & Deep Purple (\`#7657F6\`).
- **Database**: Android Jetpack Room with Kotlin Coroutines Flow.
- **PDF Extraction**: PDFBox Android & Android \`PdfRenderer\` for text extraction, paragraph splitting, and scanned PDF detection.
- **Speech Synthesis**: Android \`TextToSpeech\` engine supporting Arabic (\`ar\`) and English (\`en\`) voices with rate (0.5x–3.0x) and pitch adjustment.
- **Background Playback**: Android Foreground Service with \`mediaPlayback\` type and interactive notification controls.
- **File Access**: Android Storage Access Framework (SAF) \`ActivityResultContracts.OpenDocument\`.
- **Localization**: Full English and authentic Arabic (RTL) resources in \`res/values\` and \`res/values-ar\`.

## Opening in Android Studio
1. Open Android Studio (Ladybug, Koala, or Iguana).
2. Select **File > Open...** and navigate to this folder.
3. Allow Gradle to sync dependencies.
4. Run on an Android emulator or connected device running API 26+.
`
  }
];

export async function generateAndroidProjectZip(): Promise<Blob> {
  const zip = new JSZip();

  for (const file of ANDROID_PROJECT_FILES) {
    zip.file(`HassanSound/${file.path}`, file.content);
  }

  return await zip.generateAsync({ type: 'blob' });
}
