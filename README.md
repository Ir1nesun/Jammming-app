1. App
   хранит состояние.
   searchTerm — что ввели в поиск
   searchResults — массив найденных треков
   playlistName — имя плейлиста
   playlistTracks — массив треков в плейлисте
   позже: accessToken, userId, статус загрузки/ошибки

setSearchTerm(term) — обновить строку поиска
search() — выполнить поиск (пока заглушка → потом API)
addTrack(track) — добавить трек в плейлист (и НЕ добавить дубликат)
removeTrack(track) — удалить трек из плейлиста
updatePlaylistName(name) — обновить имя плейлиста
savePlaylist() — собрать uris и сохранить в Spotify (пока заглушка)

будет рендерить SearchBar, SearchResults, Playlist

2. SearchBar - UI для ввода поиска + кнопка Search.
   показывает searchTerm в input (controlled input)
   на ввод вызывает onSearchTermChange(newValue)
   по кнопке Search вызывает onSearch()

3. SearchResults - контейнер “результаты поиска”.
   принимает массив searchResults
   отдаёт его в TrackList
   задаёт “режим” треков: тут действие добавить (+)

4. Playlist - контейнер плейлиста + кнопка Save To Spotify.
   показывает поле с playlistName
   по вводу вызывает onNameChange(name)
   отображает playlistTracks через TrackList
   задаёт режим треков: действие удалить (-)
   по кнопке Save вызывает onSave()

5. TrackList - переиспользуемый список треков
   принимает tracks
   пробегается по ним и рендерит Track для каждого
   передаёт каждому треку:
   сам трек
   что делать при клике
   какую кнопку показать (+ или -)

6. Track - один трек
   отображает данные трека:
   название
   артист
   альбом
   показывает кнопку:

- в результатах

* в плейлисте
  по клику вызывает onAction(track)




Дерево:
App
SearchBar (инпут + кнопка Search)
SearchResults (заголовок + TrackList с результатами)
Playlist (имя плейлиста + TrackList выбранных треков + кнопка Save To Spotify)
TrackList (рендерит массив треков)
Track (одна композиция + кнопка + или -)
