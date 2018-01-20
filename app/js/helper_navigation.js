
// ---------------------------------------------------------------------------------------------------------------------
// LEFT COLUMN
// ---------------------------------------------------------------------------------------------------------------------

function setItemCounts()
{
    var NewEpisodesCount       = document.getElementById("menu-episodes").getElementsByClassName("menu-count")[0]

    if (fs.existsSync(getPlaylistFilePath()) && fs.readFileSync(getNewEpisodesSaveFilePath(), "utf-8") != "")
    {
        NewEpisodesCount.innerHTML = JSON.parse(fs.readFileSync(getNewEpisodesSaveFilePath(), "utf-8")).length
    }
    else
    {
        NewEpisodesCount.innerHTML = 0
    }

    var FavoritesCount       = document.getElementById("menu-favorites").getElementsByClassName("menu-count")[0]

    if (fs.existsSync(getPlaylistFilePath()) && fs.readFileSync(getSaveFilePath(), "utf-8") != "")
    {
        FavoritesCount.innerHTML = JSON.parse(fs.readFileSync(getSaveFilePath(), "utf-8")).length
    }
    else
    {
        FavoritesCount.innerHTML = 0
    }
}

function clearPlaylists()
{
    var AllInputFields = document.getElementById("playlists").getElementsByTagName("input")

    for (var i = 0; i < AllInputFields.length; i++)
    {
        if (!AllInputFields[i].disabled)
        {
            clearRenameFocus(AllInputFields[i])
        }
    }
}

function clearRenameFocus(_Self)
{
    if (_Self.value == "")
    {
        var HeaderName = document.getElementById("content-right-header").getElementsByTagName("h1")[0].innerHTML

        _Self.value = HeaderName
    }

    setPlaylistName(_Self)
}

function setPlaylistName(_Self)
{
    if (_Self.value != null && _Self.value != "")
    {
        var HeaderName = document.getElementById("content-right-header").getElementsByTagName("h1")[0].innerHTML
        var NewName = _Self.value

        if (fs.existsSync(getPlaylistFilePath()) && fs.readFileSync(getPlaylistFilePath(), "utf-8") != "")
        {
            JsonContent = JSON.parse(fs.readFileSync(getPlaylistFilePath(), "utf-8"))

            for (var i = 0; i < JsonContent.length; i++)
            {
                if (JsonContent[i].playlistName == HeaderName)
                {
                    JsonContent[i].playlistName = NewName

                    break
                }
            }

            fs.writeFileSync(getPlaylistFilePath(), JSON.stringify(JsonContent))

            showPlaylistContent(_Self.parentElement)
            _Self.disabled = true
        }
    }
}

function setGridLayout(_List, _Enable)
{
    if (_Enable)
    {
        _List.classList.add("grid-layout")
        // _List.style.display = "grid"
        // _List.style.gridTemplateColumns = "1fr 1fr 1fr"
    }
    else
    {
        _List.classList.remove("grid-layout")
        // _List.style.display = null
        // _List.style.gridTemplateColumns = null
    }
}


// ---------------------------------------------------------------------------------------------------------------------
// MENU & PLAYLISTS
// ---------------------------------------------------------------------------------------------------------------------

function clearMenuSelection()
{
    var Menu      = document.getElementById("menu")
    var ListItems = Menu.getElementsByTagName("li")
    var Playlists = document.getElementById("playlists").getElementsByTagName("li")

    for (var i = 0; i < ListItems.length; i++)
    {
        ListItems[i].classList.remove("selected")
    }

    for (var i = 0; i < Playlists.length; i++)
    {
        Playlists[i].classList.remove("selected")
    }
}


function dragToPlaylist(_PlaylistName, _PodcastName)
{
    var JsonContent = JSON.parse(fs.readFileSync(getPlaylistFilePath(), "utf-8"))

    for (var i = 0; i < JsonContent.length; i++)
    {
        if (JsonContent[i].playlistName == _PlaylistName)
        {
            var PodcastList = JsonContent[i].podcastList

            if (!isAlreadyInPlaylist(_PlaylistName, _PodcastName))
            {
                PodcastList.push(_PodcastName)
            }

            break
        }
    }

    fs.writeFileSync(getPlaylistFilePath(), JSON.stringify(JsonContent))
}