import { useState, useEffect, useRef } from 'react';

const useLocalContent = (contentKey, defaultContent = {}) => {
  const [data, setData] = useState(defaultContent);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // 🔥 Önceki datayı takip etmek için ref
  const prevDataRef = useRef();
  const initializedRef = useRef(false);

  // İlk yükleme effect'i - SADECE BİR KEZ ÇALIŞSIN
  useEffect(() => {
    // 🔥 Zaten yüklenmişse tekrar yükleme
    if (initializedRef.current) return;
    
    const loadContent = async () => {
      try {
        console.log(`🔄 Loading content for: ${contentKey}`);
        
        // Önce localStorage'dan kontrol et
        const savedContent = localStorage.getItem(`cms_${contentKey}`);
        
        if (savedContent) {
          console.log(`✅ Loading from localStorage: ${contentKey}`);
          const parsedData = JSON.parse(savedContent);
          setData(parsedData);
          prevDataRef.current = parsedData;
        } else {
          // localStorage'da yoksa public JSON'dan yükle
          console.log(`🌐 Loading from public JSON: /content/${contentKey}.json`);
          const response = await fetch(`/content/${contentKey}.json`);
          
          if (response.ok) {
            const jsonData = await response.json();
            console.log(`✅ Loaded from public: ${contentKey}`);
            setData(jsonData);
            prevDataRef.current = jsonData;
            
            // İlk yüklemede localStorage'a kaydet
            localStorage.setItem(`cms_${contentKey}`, JSON.stringify(jsonData));
          } else {
            throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
          }
        }
      } catch (err) {
        console.error(`💥 Error loading ${contentKey}:`, err);
        setError(err.message);
        setData(defaultContent);
        prevDataRef.current = defaultContent;
      } finally {
        setLoading(false);
        initializedRef.current = true; // 🔥 Artık yüklendi
      }
    };

    loadContent();
  }, [contentKey, defaultContent]); // 🔥 Bu dependency'ler değişirse tekrar yükle

  // Real-time updates için localStorage değişikliklerini dinle
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === `cms_${contentKey}` && e.newValue) {
        console.log(`🔄 Real-time update for: ${contentKey}`);
        try {
          const newData = JSON.parse(e.newValue);
          
          // 🔥 Aynı data değilse güncelle
          if (JSON.stringify(prevDataRef.current) !== JSON.stringify(newData)) {
            setData(newData);
            prevDataRef.current = newData;
          }
        } catch (error) {
          console.error('Error parsing updated content:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Polling backup (isteğe bağlı - gerekmiyorsa kaldırabilirsiniz)
    const interval = setInterval(() => {
      const savedContent = localStorage.getItem(`cms_${contentKey}`);
      if (savedContent) {
        try {
          const parsedData = JSON.parse(savedContent);
          
          if (JSON.stringify(prevDataRef.current) !== JSON.stringify(parsedData)) {
            console.log(`🔄 Polling update for: ${contentKey}`);
            setData(parsedData);
            prevDataRef.current = parsedData;
          }
        } catch (error) {
          console.error('Error in polling:', error);
        }
      }
    }, 3000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [contentKey]);

  return { data, loading, error };
};

export default useLocalContent;