Motion Score is an interactive web project that transforms visual movement into music.

The project is inspired by moments of impact, such as shattering glass, basketball dunks, and speeding race cars. I wanted to turn movement into a form of musical performance—allowing the position, speed, and changes of objects to be heard as well as seen.

The current version supports video object tracking and two-hand chord performance through a webcam.
Features
- Video-to-music interaction: Tracks larger fragments in a glass-shattering video, displaying object IDs, bounding boxes, and motion trails.
- Two-hand chord performance: Select and pinch to trigger seven chord clips with your left hand, while your right hand controls volume and filtering. Up to two chords can overlap.
- Motion mapping: Vertical position controls pitch, horizontal position controls stereo panning, and movement speed affects note velocity.
- Sound presets: Includes Electric Piano, Horn, Harp, and sampled bell sounds. Ocean mode adds a separately adjustable background music layer.
- Performance controls: Adjustable scale, volume, and audio toggles.
- Multilingual interface: English by default, with Simplified and Traditional Chinese options.

How to Use
Launch the Website 
https://643883yfzf-spec.github.io/music-interaction-motion-sound/

Video Mode
1. Select Video tracking.
2. Click Start playing to play the sample video.
3. Observe the fragment tracking boxes and pitch bands on the right.
4. Choose a sound preset, scale, and volume under Mapping controls.

Camera Mode
1. Select the Camera tab.
2. Click Start camera & play and allow camera access.
3. Keep both hands fully visible and separated in the left and right control zones.
4. Move your left hand horizontally to select a chord, then pinch your thumb and index finger to trigger it. Open your fingers before triggering again.
5. Move your right hand vertically to control volume and horizontally to control filtering. Click a chord card to audition it, or Stop chords to end playback.
Click Stop camera or switch back to video mode to turn off the camera. Frames are processed locally without recording or uploading. The microphone is not used.
Technology
The interface is built with HTML, CSS, and JavaScript. Canvas is used to analyze video frames, MediaPipe detects hand landmarks, and the Web Audio API generates sound.
Future Development
- Allow users to upload their own videos.
- Automatically identify visual elements or let users select the objects they want to track.
- Provide detection methods and musical mappings suited to different types of footage.
- Add editable musical phrases, sounds, and presets to support richer compositions.
My goal is for Motion Score to become an intuitive creative tool that turns everyday movements and visual moments into starting points for music.
