// ===================================================================
// BÖLÜM 1: FIREBASE YAPILANDIRMASI VE BAĞLANTI
// BU BÖLÜMÜ KENDİ FIREBASE PROJE BİLGİLERİNLE DOLDURMALISIN
// ===================================================================

const firebaseConfig = {
  apiKey: "AIzaSyDqIOXc0uJ1Ys6UOnufjzXNLcAPj5kAJJM",
  authDomain: "tanismakartisitem.firebaseapp.com",
  projectId: "tanismakartisitem",
  storageBucket: "tanismakartisitem.firebasestorage.app",
  messagingSenderId: "8642878185",
  appId: "1:8642878185:web:cb3b3b6e589937cb616e78"
};

// Firebase'i yukarıdaki yapılandırma ile başlatır ve veritabanı bağlantısını kurar.
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();


// ===================================================================
// BÖLÜM 2: HTML ELEMENTLERİNİN SEÇİLMESİ
// Kodun ilerleyen kısımlarında kullanacağımız HTML elemanlarını seçip değişkenlere atıyoruz.
// ===================================================================

const welcomeScreen = document.getElementById('welcome-screen');
const cardContainer = document.getElementById('card-container');
const yesBtn = document.getElementById('yes-btn');
const noBtn = document.getElementById('no-btn');
const contactForm = document.getElementById('contact-form');


// ===================================================================
// BÖLÜM 3: "HAYIR" BUTONU MANTIĞI
// "Hayır" butonunun kaçmasını ve 5 denemeden sonra kaybolmasını sağlayan kodlar.
// ===================================================================

let noClickCount = 0;
const MAX_ATTEMPTS = 5;

// "Hayır" butonunun yerini rastgele değiştiren fonksiyon.
function moveTheNoButton() {
  if (noClickCount >= MAX_ATTEMPTS) {
    noBtn.classList.add('hidden'); // Butonu gizle.
    return; // Fonksiyonu durdur.
  }
  
  noClickCount++; // Sayacı bir artır.

  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  const btnWidth = noBtn.offsetWidth;
  const btnHeight = noBtn.offsetHeight;

  // Butonun ekran dışına taşmayacağı rastgele pozisyonlar hesapla.
  const newTop = Math.random() * (screenHeight - btnHeight);
  const newLeft = Math.random() * (screenWidth - btnWidth);

  // Yeni pozisyonları butona uygula.
  noBtn.style.top = `${newTop}px`;
  noBtn.style.left = `${newLeft}px`;
}

// Fare "Hayır" butonunun üzerine geldiğinde pozisyonunu değiştir.
noBtn.addEventListener('mouseover', moveTheNoButton);

// İnatla tıklamaya çalışanlar için de aynı fonksiyonu çağır.
noBtn.addEventListener('click', moveTheNoButton);


// ===================================================================
// BÖLÜM 4: "EVET" BUTONU MANTIĞI
// "Evet" butonuna tıklandığında karşılama ekranını gizleyip tanışma kartını gösterir.
// ===================================================================

yesBtn.addEventListener('click', () => {
  welcomeScreen.classList.add('hidden');
  cardContainer.classList.remove('hidden');
});


// ===================================================================
// BÖLÜM 5: FORM GÖNDERME MANTIĞI
// Doldurulan formdaki verileri toplayıp Firebase veritabanına gönderir.
// ===================================================================

contactForm.addEventListener('submit', (event) => {
  // Formun varsayılan "sayfayı yenileme" davranışını engelle.
  event.preventDefault();

  const submitBtn = document.getElementById('submit-btn');
  // Kullanıcıya işlem yapıldığını bildirmek için butonu geçici olarak devre dışı bırak.
  submitBtn.disabled = true;
  submitBtn.textContent = 'Gönderiliyor...';

  // Formdaki tüm verileri bir JavaScript objesinde topla.
  const formData = {
    isim: contactForm.isim.value,
    soyisim: contactForm.soyisim.value,
    dogumTarihi: contactForm['dogum-tarihi'].value,
    nereli: contactForm.nereli.value,
    aktiviteler: contactForm.aktiviteler.value,
    ucKelime: contactForm['uc-kelime'].value,
    gonderimTarihi: new Date() // Verinin gönderildiği anın tarihini de ekle.
  };

  // Toplanan verileri "tanisma-istekleri" koleksiyonuna yeni bir doküman olarak ekle.
  db.collection("tanisma-istekleri").add(formData)
    .then((docRef) => {
      // İşlem BAŞARILI olursa...
      console.log("Veri başarıyla kaydedildi. Doküman ID: ", docRef.id);
      alert('Harika! Bilgilerin bana ulaştı. En kısa zamanda tanışmak dileğiyle!');
      contactForm.reset(); // Form alanlarını temizle.
    })
    .catch((error) => {
      // İşlem sırasında bir HATA oluşursa...
      console.error("Veri kaydedilirken bir hata oluştu: ", error);
      alert('Üzgünüm, bir şeyler ters gitti. Lütfen tekrar dener misin?');
    })
    .finally(() => {
      // İşlem başarılı da olsa, hatalı da olsa EN SONUNDA bu kod çalışır.
      // Butonu tekrar aktif ve tıklanabilir hale getir.
      submitBtn.disabled = false;
      submitBtn.textContent = 'Tanış!';
    });
});