Motion Score
Motion Score is an interactive web project that transforms visual movement into music.

The project is inspired by moments of impact, such as shattering glass, basketball dunks, and speeding race cars. I wanted to turn movement into a form of musical performance—allowing the position, speed, and changes of objects to be heard as well as seen.

The current version supports video object tracking and live fingertip performance through a webcam.
Features
- Video-to-music interaction: Tracks larger fragments in a glass-shattering video, displaying object IDs, bounding boxes, and motion trails.
- Fingertip performance: Detects up to two hands through a webcam, with each fingertip triggering notes independently.
- Motion mapping: Vertical position controls pitch, horizontal position controls stereo panning, and movement speed affects note velocity.
- Sound presets: Includes two synthesized sounds: Electric Piano and Horn.
- Performance controls: Adjustable scale, volume, and audio toggles.
- Multilingual interface: English by default, with Simplified and Traditional Chinese options.
How to Use
Launch the Website
After downloading the project, start a local server inside the dist folder containing index.html. For example, with Python installed, run:
cd dist
python -m http.server 8766 --bind 127.0.0.1
Then open the following address in your browser:
http://localhost:8766/
Video Mode
1. Select Video tracking.
2. Click Start playing to play the sample video.
3. Observe the fragment tracking boxes and pitch bands on the right.
4. Choose a sound preset, scale, and volume under Mapping controls.
The glass video uses a preconfigured large-fragment tracking method. Visual feedback indicates which fragments are triggering sounds.
Camera Mode
1. Select Camera · Finger play.
2. Click Start camera & play and allow camera access.
3. Keep your entire hand and fingers within the frame.
4. Move your fingertips to perform: moving upward raises the pitch, moving horizontally changes stereo panning, and faster movement increases note velocity.
Click Stop camera or switch back to video mode to turn off the camera. Frames are processed locally without recording or uploading. The microphone is not used.
Technology
The interface is built with HTML, CSS, and JavaScript. Canvas is used to analyze video frames, MediaPipe detects hand landmarks, and the Web Audio API generates sound.
Future Development
- Allow users to upload their own videos.
- Automatically identify visual elements or let users select the objects they want to track.
- Provide detection methods and musical mappings suited to different types of footage.
- Add editable musical phrases, sounds, and presets to support richer compositions.
My goal is for Motion Score to become an intuitive creative tool that turns everyday movements and visual moments into starting points for music.
