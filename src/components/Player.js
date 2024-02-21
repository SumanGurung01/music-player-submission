import React, { useEffect, useRef, useState } from "react";
import "../styles/Player.css";
import { Trash, Upload } from "lucide-react";

function Player() {
    const [playlist, setPlaylist] = useState([]);
    const [playing, setPlaying] = useState();
    const audioRef = useRef();

    const uploadSong = (e) => {
        const file = e.target.files[0];
        // if no file is selected
        if (!file) return;

        const songToAdd = {
            name: file.name,
            id: Date.now(),
            src: URL.createObjectURL(file)
        };

        // clear selection after getting the selected song
        e.target.value = null;

        // check song with same name exist or not
        const exist = playlist.find((track) => track.name === songToAdd.name);

        //if exist then alert and return
        if (exist) {
            alert("Song Already Exist");
            return;
        }

        // else add to playlist
        setPlaylist([...playlist, songToAdd]);
    };

    const playSong = (songIdx) => {
        const songToPlay = playlist.find((track) => track.id === songIdx);
        if (songToPlay) {
            setPlaying(songToPlay);
        }
    };

    function playNext() {
        const currentSongIndex = playlist.filter((track, index) => {
            if (track.id === playing.id) {
                return index;
            }
        });

        setPlaying(playlist[currentSongIndex + 1]);
    }

    const removeSong = (songIdx) => {
        const newPlaylist = playlist.filter((track) => track.id !== songIdx);
        setPlaylist(newPlaylist);
    };

    useEffect(() => {
        if (!playing) return;
        console.log(playing);
        audioRef.current.load();
    }, [playing]);

    return (
        <div className="main">
            <div className="main-container">
                <p className="heading">React Music Player</p>

                <input
                    type="file"
                    accept="audio/mp3"
                    multiple
                    onChange={uploadSong}
                    id="input-id"
                    className="song-input"
                />

                <label htmlFor="input-id" className="upload-button">
                    <p>Upload Track</p>
                    <Upload size={16} />
                </label>

                <div className="playlist-container">
                    <p className="playlist">
                        {playlist.length === 0
                            ? "Your playlist is empty :("
                            : "Your playlist"}
                    </p>

                    {playlist.map((track, idx) => (
                        <div
                            key={track.id}
                            className="playlist-track"
                            onClick={() => playSong(track.id)}
                        >
                            <p>
                                {idx + 1}. {track.name}
                            </p>

                            <Trash
                                onClick={(e) => {
                                    e.stopPropagation();
                                    removeSong(track.id);
                                }}
                                size={16}
                            />
                        </div>
                    ))}
                </div>
                <div>
                    {playing ? (
                        <>
                            <p className="playing">
                                Now Playing - {playing.name}
                            </p>

                            <audio
                                controls
                                autoPlay
                                ref={audioRef}
                                onEnded={playNext}
                            >
                                <source src={playing.src} type="audio/mp3" />
                            </audio>
                        </>
                    ) : null}
                </div>
            </div>
        </div>
    );
}

export default Player;
