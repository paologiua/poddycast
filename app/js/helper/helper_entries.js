
// ---------------------------------------------------------------------------------------------------------------------
// RIGHT COLUMN
// ---------------------------------------------------------------------------------------------------------------------


function unsubscribeListElement(self) {
    let feedUrl = $(self).parent().parent().find('.podcast-entry-header').attr('feedUrl');
    allFavoritePodcasts.removeByFeedUrl(feedUrl);
}

function unsubscribeContextMenu(_FeedUrl) {
    allFavoritePodcasts.removeByFeedUrl(_FeedUrl);
    showFavoritesPage();
}

function setHeartContent(self, emptyHeart) {
    $(self)
        .stop()
        .removeAttr('style')
    
    if(emptyHeart) {
        $(self).animate(
            {opacity: 0.4}, 
            150, 
            function() {
                $(self)
                    .html($(s_Heart).html())
                    .animate(
                        {opacity: 0.6}, 
                        150, 
                        function () {
                            $(self).removeAttr('style');
                        });
            }
        );
    } else 
        $(self).html($(s_FullHeart).html());
}

function removeFromFile(_File, _ContentReference, _Value, _Break)
{
    if (fs.readFileSync(_File(), "utf-8") != "")
    {
        var JsonContent = JSON.parse(fs.readFileSync(_File(), "utf-8"))

        for (var i = JsonContent.length - 1; i >= 0 ; i--)
        {
            if (_Value == JsonContent[i][_ContentReference])
            {
                JsonContent.splice(i, 1)

                if (_Break) { break }
            }
        }

        fs.writeFileSync(_File(), JSON.stringify(JsonContent, null, "\t"))
    }
}

// ---------------------------------------------------------------------------------------------------------------------
// PODCAST ENTRY
// ---------------------------------------------------------------------------------------------------------------------

function getPodcastElement(_Class, _Artwork, _Subtitle, _Title, _IconElement, _TailElement, _HeaderLayout)
{
    var ListElement     = document.createElement("li")
    var HeaderElement   = document.createElement("div")
    var ActionsElement  = document.createElement("div")
    var BodyElement     = document.createElement("div")

    var TitleElement    = document.createElement("div")
    var SubtitleElement = document.createElement("div")
    var ImageElement    = document.createElement("img")
    var TailElement     = document.createElement("div")

    if (_HeaderLayout == null)
        HeaderElement.classList.add("podcast-entry-header")
    else
        HeaderElement.classList.add(_HeaderLayout)

    ActionsElement.classList.add("podcast-entry-actions")
    BodyElement.classList.add("podcast-entry-body")

    ImageElement.src = _Artwork

    TitleElement.innerHTML = _Title
    TitleElement.classList.add("podcast-entry-title")

    SubtitleElement.innerHTML = _Subtitle
    SubtitleElement.classList.add("podcast-entry-subtitle")

    TailElement.innerHTML = (_TailElement == undefined ? "" : _TailElement)
    TailElement.classList.add("podcast-entry-tail")

    ListElement.classList.add("podcast-entry")

    if (_Class != null) { 
        ListElement.classList.remove("podcast-entry"); 
        ListElement.classList.add(_Class) 
    }

    if (_IconElement != undefined) 
        ActionsElement.innerHTML = _IconElement 
    
    if (_Artwork != null) 
        HeaderElement.append(ImageElement) 
    
    if (_Subtitle != null) 
        HeaderElement.append(SubtitleElement)

    HeaderElement.append(TitleElement)
    HeaderElement.append(TailElement)

    ListElement.append(HeaderElement)
    ListElement.append(ActionsElement)
    ListElement.append(BodyElement)

    return ListElement
}

function getStatisticsElement(_Class, _Title, _Value)
{
    var ListElement = document.createElement("li")
    var Title = document.createElement("div")
    var Value = document.createElement("div")

    Title.innerHTML = _Title
    Title.classList.add("statistics-entry-title")

    if (_Value != null)
    {
        Value.innerHTML = _Value
        Value.classList.add("statistics-entry-value")
    }

    // ListElement.classList.add("statistics-entry")

    ListElement.classList.add(_Class)
    ListElement.append(Title)

    if (_Value != null)
    {
        ListElement.append(Value)
    }

    return ListElement
}
/*
function setPodcastElementToDone(_ListElement)
{
    _ListElement.getElementsByClassName("podcast-entry-title")[0].classList.add("done")
}
*/
function deleteEntryWithIcon(_Self)
{
    deleteEntry(_Self.parentElement.parentElement)
}
/*
function deleteEntryWithAudioPlayer(_FeedUrl)
{
    // TODO: just catch list element if new episodes menu is open

    var AllListElements = document.getElementById("list").getElementsByTagName("li")
}
*/
function deleteEntry(_ListElement) {
    //if(
    deleteFromFile(_ListElement.getAttribute("url"))
    //)
    //    deleteFromListView(_ListElement);

    //setItemCounts();
}
/*
function deleteFromListView(_ListElement) {
    $(_ListElement)
        .animate({opacity: 0.0}, 150)
        .slideUp(150, function () { 
            this.remove(); 
        });
    allNewEpisodes.ui.updateAfterDelete();
}
*/
function deleteFromFile(episodeUrl) {
    let episode = allNewEpisodes.getByEpisodeUrl(episodeUrl);
    if(!episode)
        return false;

    let archivedEpisode = {
        "channelName": episode.channelName,
        "episodeTitle": episode.episodeTitle,
        "episodeUrl": episode.episodeUrl,
        "artwork": getBestArtworkUrl(episode.feedUrl),
        "archivedType": "deleted",
        "date": new Date
    }

    let ArchiveFileContent = ifExistsReadFile(getArchivedFilePath());
    let ArchiveJsonContent = JSON.parse(ArchiveFileContent == "" ? "[]": ArchiveFileContent);
    ArchiveJsonContent.push(archivedEpisode);
    fs.writeFileSync(getArchivedFilePath(), JSON.stringify(ArchiveJsonContent, null, "\t"))

    allNewEpisodes.removeByEpisodeUrl(episodeUrl);
    return true;
}

