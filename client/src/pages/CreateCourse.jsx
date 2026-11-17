import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';
import { UploadCloud, PenTool, Image as ImageIcon, Loader2 } from 'lucide-react';

const CreateCourse = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { id } = useParams(); 
  
  const isEditMode = Boolean(id); 

  const [formData, setFormData] = useState({
    title: '', description: '', category: '', price: '', thumbnail: '', 
  });

  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [fetching, setFetching] = useState(isEditMode);

  useEffect(() => {
    if (isEditMode) {
      const fetchCourse = async () => {
        try {
          const response = await axios.get(`https://lms-backend-api-ybnd.onrender.com/api/courses/${id}`);
          const course = response.data;
          
          if (course.instructor._id !== user._id) {
            toast.error("Not authorized to edit this course");
            return navigate('/dashboard');
          }

          setFormData({
            title: course.title,
            description: course.description,
            category: course.category,
            price: course.price,
            thumbnail: course.thumbnail,
          });
        } catch (error) {
          toast.error("Failed to load course details");
          navigate('/dashboard');
        } finally {
          setFetching(false);
        }
      };
      fetchCourse();
    }
  }, [id, isEditMode, user, navigate]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadData = new FormData();
    uploadData.append('file', file);

    setUploading(true);
    try {
      const response = await axios.post('https://lms-backend-api-ybnd.onrender.com/api/upload', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setFormData({ ...formData, thumbnail: response.data.url });
      toast.success(isEditMode ? 'Thumbnail updated!' : 'Thumbnail uploaded!');
    } catch (error) {
      toast.error('Failed to upload image.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.thumbnail) {
      return toast.error('Please upload a course thumbnail image first!');
    }

    setSubmitting(true);
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      
      if (isEditMode) {
        await axios.put(`https://lms-backend-api-ybnd.onrender.com/api/courses/${id}`, formData, config);
        toast.success('Course updated successfully!');
        navigate(`/course/${id}`);
      } else {
        await axios.post('https://lms-backend-api-ybnd.onrender.com/api/courses', formData, config);
        toast.success('Course created successfully!');
        
        // ✅ BUG FIXED: Redirecting safely to /dashboard instead of a 404 page
        navigate('/dashboard'); 
      }
    } catch (error) {
      toast.error(error.response?.data?.message || `Failed to ${isEditMode ? 'update' : 'create'} course`);
    } finally {
      setSubmitting(false);
    }
  };

  if (fetching) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
      <Loader2 size={48} color="#4f46e5" style={{ animation: 'spin 1s linear infinite', marginBottom: '1rem' }} />
      <h3 style={{ color: '#4b5563' }}>Loading Studio...</h3>
      <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', padding: '3rem 5% 5rem 5%' }}>
      <div style={{ 
        maxWidth: '800px', 
        margin: '0 auto', 
        background: '#ffffff', 
        padding: '3rem', 
        borderRadius: '1.5rem', 
        boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)',
        border: '1px solid #f1f5f9'
      }}>
        
        <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1.5rem' }}>
          <div style={{ background: '#e0e7ff', padding: '0.8rem', borderRadius: '0.75rem', color: '#4f46e5' }}>
            <PenTool size={28} />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.8rem', color: '#0f172a' }}>
              {isEditMode ? 'Edit Course Details' : 'Create a New Course'}
            </h1>
            <p style={{ margin: '0.3rem 0 0 0', color: '#64748b' }}>
              Fill in the details below to {isEditMode ? 'update your' : 'publish a new'} course.
            </p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#334155', marginBottom: '0.5rem' }}>Course Title</label>
            <input type="text" placeholder="e.g. Master React in 30 Days" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required 
              style={{ width: '100%', padding: '1rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', background: '#f8fafc', fontSize: '1rem', outline: 'none', transition: 'border-color 0.2s' }} 
              onFocus={(e)=>e.target.style.borderColor='#4f46e5'} onBlur={(e)=>e.target.style.borderColor='#cbd5e1'} 
            />
          </div>
          
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 300px' }}>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#334155', marginBottom: '0.5rem' }}>Category</label>
              <input type="text" placeholder="e.g. Web Development" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} required 
                style={{ width: '100%', padding: '1rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', background: '#f8fafc', fontSize: '1rem', outline: 'none', transition: 'border-color 0.2s' }} 
                onFocus={(e)=>e.target.style.borderColor='#4f46e5'} onBlur={(e)=>e.target.style.borderColor='#cbd5e1'} 
              />
            </div>
            
            <div style={{ flex: '1 1 200px' }}>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#334155', marginBottom: '0.5rem' }}>Course Price (₹)</label>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ padding: '1rem 1.2rem', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRight: 'none', borderRadius: '0.5rem 0 0 0.5rem', color: '#64748b', fontWeight: 'bold' }}>₹</span>
                <input type="number" placeholder="499" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} required min="0" 
                  style={{ width: '100%', padding: '1rem', borderRadius: '0 0.5rem 0.5rem 0', border: '1px solid #cbd5e1', background: '#f8fafc', fontSize: '1rem', outline: 'none', transition: 'border-color 0.2s' }} 
                  onFocus={(e)=>e.target.style.borderColor='#4f46e5'} onBlur={(e)=>e.target.style.borderColor='#cbd5e1'} 
                />
              </div>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#334155', marginBottom: '0.5rem' }}>Course Thumbnail (Image)</label>
            <div style={{ border: '2px dashed #cbd5e1', borderRadius: '1rem', padding: '2rem', textAlign: 'center', background: '#f8fafc', position: 'relative', overflow: 'hidden' }}>
              
              {formData.thumbnail ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <img src={formData.thumbnail} alt="Preview" style={{ width: '100%', maxWidth: '400px', height: 'auto', borderRadius: '0.5rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', marginBottom: '1rem' }} />
                  <input type="file" id="file-upload" style={{ display: 'none' }} accept="image/*" onChange={handleFileUpload} />
                  <label htmlFor="file-upload" style={{ display: 'inline-flex', gap: '0.5rem', alignItems: 'center', cursor: 'pointer', padding: '0.8rem 1.5rem', background: 'white', color: '#4f46e5', border: '1px solid #4f46e5', borderRadius: '50px', fontWeight: '600', fontSize: '0.9rem', transition: 'all 0.2s' }} onMouseOver={(e)=>e.currentTarget.style.background='#e0e7ff'} onMouseOut={(e)=>e.currentTarget.style.background='white'}>
                    <ImageIcon size={18} /> {uploading ? 'Uploading...' : 'Change Cover Image'}
                  </label>
                </div>
              ) : (
                <>
                  <UploadCloud size={48} color="#94a3b8" style={{ marginBottom: '1rem' }} />
                  <h4 style={{ margin: '0 0 0.5rem 0', color: '#334155' }}>Upload a cover image</h4>
                  <p style={{ margin: '0 0 1.5rem 0', color: '#64748b', fontSize: '0.85rem' }}>16:9 ratio recommended (Max 5MB)</p>
                  
                  <input type="file" id="file-upload" style={{ display: 'none' }} accept="image/*" onChange={handleFileUpload} />
                  <label htmlFor="file-upload" style={{ display: 'inline-flex', gap: '0.5rem', alignItems: 'center', cursor: 'pointer', padding: '0.8rem 1.5rem', background: '#4f46e5', color: 'white', borderRadius: '50px', fontWeight: '600', fontSize: '0.9rem', transition: 'transform 0.2s' }} onMouseOver={(e)=>e.currentTarget.style.transform='scale(1.05)'} onMouseOut={(e)=>e.currentTarget.style.transform='scale(1)'}>
                    {uploading ? <Loader2 size={18} style={{animation: 'spin 1s linear infinite'}}/> : <UploadCloud size={18} />} 
                    {uploading ? 'Uploading...' : 'Browse Files'}
                  </label>
                </>
              )}
            </div>
          </div>
          
          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#334155', marginBottom: '0.5rem' }}>Course Description</label>
            <textarea rows="6" placeholder="What will students learn in this course?" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required 
              style={{ width: '100%', padding: '1rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', background: '#f8fafc', fontSize: '1rem', outline: 'none', transition: 'border-color 0.2s', resize: 'vertical' }} 
              onFocus={(e)=>e.target.style.borderColor='#4f46e5'} onBlur={(e)=>e.target.style.borderColor='#cbd5e1'} 
            ></textarea>
          </div>
          
          <button type="submit" disabled={uploading || submitting} 
            style={{ 
              width: '100%', padding: '1.2rem', background: '#4f46e5', color: 'white', border: 'none', 
              borderRadius: '0.75rem', fontSize: '1.1rem', fontWeight: 'bold', cursor: (uploading || submitting) ? 'not-allowed' : 'pointer', 
              boxShadow: '0 4px 15px rgba(79, 70, 229, 0.3)', transition: 'background 0.2s, transform 0.2s',
              display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginTop: '1rem'
            }} 
            onMouseOver={(e)=> { if(!uploading && !submitting) e.currentTarget.style.transform='translateY(-2px)' }} 
            onMouseOut={(e)=> { if(!uploading && !submitting) e.currentTarget.style.transform='translateY(0)' }}
          >
            {submitting ? (
              <><Loader2 size={22} style={{animation: 'spin 1s linear infinite'}}/> {isEditMode ? 'Saving Changes...' : 'Publishing Course...'}</>
            ) : (
              isEditMode ? 'Save Changes' : 'Publish Course'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateCourse;