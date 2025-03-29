const video = document.getElementById('video');
const startScan = document.getElementById('startScan');
const attendanceList = document.getElementById('attendanceList');
let scanner;

async function startScanner() {
    console.log("Start Scanning Clicked!");

    // Check if ZXing is loaded
    if (typeof ZXing === 'undefined' || !ZXing.BrowserBarcodeReader) {
        alert("Error: ZXing library failed to load. Please check your internet connection.");
        return;
    }

    try {
        scanner = new ZXing.BrowserBarcodeReader();
        console.log("Scanner Initialized");

        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        video.srcObject = stream;

        console.log("Camera Access Granted");

        scanner.decodeFromVideoDevice(undefined, video, (result, err) => {
            if (result) {
                console.log("Barcode Detected: " + result.text);
                addAttendance(result.text);
            }
        });

    } catch (error) {
        console.error("Error accessing camera:", error);
        alert("Camera error: " + error.message);
    }
}

function addAttendance(studentId) {
    if (!document.getElementById(studentId)) {
        const li = document.createElement('li');
        li.id = studentId;
        li.textContent = `Student ID: ${studentId} - Time: ${new Date().toLocaleTimeString()}`;
        attendanceList.appendChild(li);
    } else {
        alert(`Student ID ${studentId} is already marked present.`);
    }
}

startScan.addEventListener('click', startScanner);
