import os
import uuid
import mimetypes
from flask import current_app

try:
    import magic
    HAS_MAGIC = True
except Exception:
    HAS_MAGIC = False

ALLOWED_IMAGE_EXTENSIONS = {"jpg", "jpeg", "png", "webp", "gif"}
ALLOWED_VIDEO_EXTENSIONS = {"mp4", "webm"}
ALLOWED_PDF_EXTENSIONS = {"pdf"}

ALLOWED_IMAGE_MIMES = {"image/jpeg", "image/png", "image/webp", "image/gif"}
ALLOWED_VIDEO_MIMES = {"video/mp4", "video/webm"}
ALLOWED_PDF_MIMES = {"application/pdf"}

def get_file_extension(filename):
    if "." not in filename:
        return ""
    return filename.rsplit(".", 1)[1].lower()

def save_uploaded_file(file, category):
    """
    category: 'photos' | 'videos' | 'pdfs' | 'screenshots'
    """
    if not file or file.filename == "":
        raise ValueError("No file provided")
        
    filename = file.filename
    ext = get_file_extension(filename)
    
    # Read start of file for mime type verification
    header = file.read(2048)
    file.seek(0) # reset pointer
    
    mime = "application/octet-stream"
    if HAS_MAGIC:
        try:
            mime = magic.from_buffer(header, mime=True)
        except Exception:
            guess, _ = mimetypes.guess_type(filename)
            if guess:
                mime = guess
    else:
        guess, _ = mimetypes.guess_type(filename)
        if guess:
            mime = guess

    # Validation check based on category
    if category == "photos":
        if ext not in ALLOWED_IMAGE_EXTENSIONS or mime not in ALLOWED_IMAGE_MIMES:
            raise ValueError("Invalid image file or extension")
        file.seek(0, os.SEEK_END)
        size = file.tell()
        file.seek(0)
        if size > 5 * 1024 * 1024:
            raise ValueError("Image exceeds maximum size of 5MB")
            
    elif category == "screenshots":
        if ext not in ALLOWED_IMAGE_EXTENSIONS or mime not in ALLOWED_IMAGE_MIMES:
            raise ValueError("Invalid screenshot file or extension")
        file.seek(0, os.SEEK_END)
        size = file.tell()
        file.seek(0)
        if size > 5 * 1024 * 1024:
            raise ValueError("Screenshot exceeds maximum size of 5MB")
            
    elif category == "videos":
        if ext not in ALLOWED_VIDEO_EXTENSIONS or mime not in ALLOWED_VIDEO_MIMES:
            raise ValueError("Invalid video file or extension")
        file.seek(0, os.SEEK_END)
        size = file.tell()
        file.seek(0)
        if size > 100 * 1024 * 1024:
            raise ValueError("Video exceeds maximum size of 100MB")
            
    elif category == "pdfs":
        if ext not in ALLOWED_PDF_EXTENSIONS or mime not in ALLOWED_PDF_MIMES:
            raise ValueError("Invalid PDF file or extension")
        file.seek(0, os.SEEK_END)
        size = file.tell()
        file.seek(0)
        if size > 10 * 1024 * 1024:
            raise ValueError("PDF exceeds maximum size of 10MB")
    else:
        raise ValueError("Invalid file category")
        
    # Generate unique filename using UUID4
    unique_filename = f"{uuid.uuid4()}.{ext}"
    
    # Save the file
    save_dir = os.path.join(current_app.config["UPLOAD_FOLDER"], category)
    os.makedirs(save_dir, exist_ok=True)
    filepath = os.path.join(save_dir, unique_filename)
    
    file.save(filepath)
    
    # Return the relative URL
    return f"/uploads/{category}/{unique_filename}"

def delete_file(relative_url):
    if not relative_url:
        return False
    parts = relative_url.split("/uploads/")
    if len(parts) != 2:
        return False
        
    rel_path = parts[1]
    filepath = os.path.join(current_app.config["UPLOAD_FOLDER"], rel_path)
    if os.path.exists(filepath):
        try:
            os.remove(filepath)
            return True
        except OSError:
            return False
    return False
