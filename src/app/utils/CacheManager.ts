class StorageManager {
  setValue(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }
  getValue(key) {
    try {
      return JSON.parse(localStorage.getItem(key));
    } catch (error) {
      console.log('error on setting LocalStorage', error)
      return false;
    }
  }
}

const storageManager = new StorageManager();

class CacheManager {
  setValue(key, value) {
    storageManager.setValue(key, value);
  }

  getValue(key) {
    return storageManager.getValue(key);
  }
}

export default new CacheManager();
