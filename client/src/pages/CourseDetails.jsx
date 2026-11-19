import { useEffect, useState, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { AuthContext } from '../context/AuthContext';
import { 
  CheckCircle, Loader2, PlayCircle, FileText, Lock, 
  Trash2, Edit3, ArrowLeft, Award, CreditCard, PlusCircle 
} from 'lucide-react'; 

// ✅ Live Chat Component Import
import CourseDiscussion from '../components/CourseDiscussion';

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]); 
  const [completedLessons, setCompletedLessons] = useState([]); 
  const [loading, setLoading] = useState(true);
  
  const [showCheckout, setShowCheckout] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [checkoutData, setCheckoutData] = useState({ name: user?.name || '', cardNumber: '' });

  const [lessonTitle, setLessonTitle] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [addingLesson, setAddingLesson] = useState(false);

  const [downloadingCert, setDownloadingCert] = useState(false);

  // 🟢 LIVE BACKEND URL SETUP
  const API_URL = import.meta.env.VITE_API_URL || "https://lms-backend-api-ybnd.onrender.com/api";

  const fetchCourseData = async () => {
    try {
      const config = user ? { headers: { Authorization: `Bearer ${user.token}` } } : {};

      // 1. Primary Course Fetch
      const courseRes = await axios.get(`${API_URL}/courses/${id}`);
      setCourse(courseRes.data);

      // 2. Lessons Fetch (Safe fallback if empty or 404)
      try {
        const lessonsRes = await axios.get(`${API_URL}/lessons/${id}`);
        setLessons(Array.isArray(lessonsRes.data) ? lessonsRes.data : []);
      } catch (lessonErr) {
        console.warn("No lessons found yet:", lessonErr);
        setLessons([]);
      }

      // 3. Progress Fetch (Only for logged-in users, safe fallback)
      if (user) {
        try {
          const progressRes = await axios.get(`${API_URL}/progress/${id}`, config);
          setCompletedLessons(progressRes.data?.completedLessons || []);
        } catch (progErr) {
          console.warn("No progress record found yet:", progErr);
          setCompletedLessons([]);
        }
      }
    } catch (err) {
      console.error("Failed to fetch course:", err);
      toast.error(err.response?.data?.message || 'Failed to load course details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourseData();
  }, [id, user]);

  // DELETE COURSE
  const handleDeleteCourse = async () => {
    if (window.confirm("Are you sure you want to delete this entire course? This action cannot be undone.")) {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        await axios.delete(`${API_URL}/courses/${id}`, config);
        toast.success("Course deleted successfully");
        navigate(user?.role === 'admin' ? '/admin' : '/dashboard');
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to delete course");
      }
    }
  };

  // PAYMENT LOGIC
  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setProcessingPayment(true);
    setTimeout(async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        await axios.post(`${API_URL}/courses/${id}/enroll`, {}, config);
        toast.success('Payment Successful! You are enrolled.');
        setShowCheckout(false);
        fetchCourseData(); 
      } catch (err) {
        toast.error(err.response?.data?.message || 'Enrollment failed');
      } finally {
        setProcessingPayment(false);
      }
    }, 2000);
  };

  // PROGRESS LOGIC
  const markAsComplete = async (lessonId) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.post(`${API_URL}/progress/mark-complete`, { courseId: id, lessonId: lessonId }, config);
      setCompletedLessons([...completedLessons, lessonId]);
      toast.success('Lesson marked as complete! 🎉');
    } catch (error) {
      toast.error('Failed to mark lesson complete');
    }
  };

  // CERTIFICATE LOGIC
  const downloadCertificate = async () => {
    setDownloadingCert(true);
    try {
      const config = { 
        headers: { Authorization: `Bearer ${user.token}` },
        responseType: 'blob' 
      };
      
      const response = await axios.get(`${API_URL}/progress/certificate/${id}`, config);
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${course.title}_Certificate.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.success("Certificate Downloaded!");
    } catch (error) {
      toast.error("Failed to download certificate");
    } finally {
      setDownloadingCert(false);
    }
  };

  // FILE UPLOAD (LESSONS)
  const handleLessonUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    const uploadData = new FormData();
    uploadData.append('file', file);
    if (type === 'video') setUploadingVideo(true);
    if (type === 'pdf') setUploadingPdf(true);
    try {
      const response = await axios.post(`${API_URL}/upload`, uploadData, { headers: { 'Content-Type': 'multipart/form-data' } });
      if (type === 'video') setVideoUrl(response.data.url);
      if (type === 'pdf') setPdfUrl(response.data.url);
      toast.success(`${type.toUpperCase()} uploaded to cloud!`);
    } catch (error) {
      toast.error(`Failed to upload ${type}`);
    } finally {
      if (type === 'video') setUploadingVideo(false);
      if (type === 'pdf') setUploadingPdf(false);
    }
  };

  const handleAddLesson = async (e) => {
    e.preventDefault();
    if (!videoUrl) return toast.error('Please upload a video lecture!');
    setAddingLesson(true);
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const response = await axios.post(`${API_URL}/lessons/${id}`, { title: lessonTitle, videoUrl: videoUrl, pdfUrl: pdfUrl }, config);
      toast.success('Lesson published successfully!');
      setLessons([...lessons, response.data]);
      setLessonTitle(''); setVideoUrl(''); setPdfUrl('');
    } catch (err) {
      toast.error('Failed to add lesson');
    } finally {
      setAddingLesson(false);
    }
  };

  // 🟢 PREMIUM LOADING STATE
  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
      <Loader2 size={48} color="#4f46e5" style={{ animation: 'spin 1s linear infinite', marginBottom: '1rem' }} />
      <h3 style={{ color: '#4b5563' }}>Loading Course Content...</h3>
      <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (!course) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 2rem' }}>
        <h2 style={{ color: '#1e293b', marginBottom: '1rem' }}>Course not found.</h2>
        <Link to="/" style={{ color: '#4f46e5', fontWeight: '600', textDecoration: 'none' }}>
          ← Return to Home
        </Link>
      </div>
    );
  }

  const isEnrolled = course.studentsEnrolled?.some(
    (studentId) => (typeof studentId === 'object' ? studentId._id : studentId) === user?._id
  );
  const courseInstructorId = typeof course.instructor === 'object' ? course.instructor?._id : course.instructor;
  const isCourseOwner = user?._id === courseInstructorId || user?.role === 'admin';
  const progressPercentage = lessons.length === 0 ? 0 : Math.round((completedLessons.length / lessons.length) * 100);
  const backLink = !user ? '/' : user.role === 'admin' ? '/admin' : '/dashboard';
  const backLabel = !user ? 'Back to Home' : user.role === 'admin' ? 'Back to Admin Panel' : 'Back to Dashboard';

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', paddingBottom: '4rem' }}>
      
      {/* 🚀 HERO SECTION (Dark Premium Theme) */}
      <div style={{ background: 'linear-gradient(to right, #0f172a, #1e293b)', color: 'white', padding: '3rem 5%', borderBottom: '4px solid #4f46e5' }}>
        <div style={{ width: '100%', maxWidth: '1100px', margin: '0 auto' }}>
          
          <Link to={backLink} style={{ color: '#94a3b8', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', marginBottom: '1.5rem', transition: 'color 0.2s' }} onMouseOver={(e)=>e.currentTarget.style.color='white'} onMouseOut={(e)=>e.currentTarget.style.color='#94a3b8'}>
            <ArrowLeft size={18} /> {backLabel}
          </Link>

          <div style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap', alignItems: 'center' }}>
            {/* Left Content */}
            <div style={{ flex: '1 1 500px' }}>
              <span style={{ background: '#4f46e5', padding: '0.4rem 1rem', borderRadius: '50px', fontSize: '0.85rem', fontWeight: '600', color: 'white', textTransform: 'uppercase', letterSpacing: '1px' }}>
                {course.category}
              </span>
              <h1 style={{ margin: '1rem 0', fontSize: '2.8rem', lineHeight: '1.2', fontWeight: '800' }}>{course.title}</h1>
              <p style={{ color: '#cbd5e1', fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '2rem' }}>
                {course.description}
              </p>
              
              <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <h2 style={{ color: '#fff', margin: 0, fontSize: '2.2rem' }}>
                  {course.price === 0 ? 'Free' : `₹${course.price}`}
                </h2>
                
                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '1rem' }}>
                  {isCourseOwner && (
                    <>
                      <Link to={`/edit-course/${course._id}`} style={{ padding: '0.8rem 1.5rem', background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', transition: 'background 0.2s' }} onMouseOver={(e)=>e.currentTarget.style.background='rgba(255,255,255,0.2)'} onMouseOut={(e)=>e.currentTarget.style.background='rgba(255,255,255,0.1)'}>
                        <Edit3 size={18} /> Edit
                      </Link>
                      <button onClick={handleDeleteCourse} style={{ padding: '0.8rem 1.5rem', background: '#ef4444', color: 'white', border: 'none', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: '600', transition: 'background 0.2s' }} onMouseOver={(e)=>e.currentTarget.style.background='#dc2626'} onMouseOut={(e)=>e.currentTarget.style.background='#ef4444'}>
                        <Trash2 size={18} /> Delete
                      </button>
                    </>
                  )}

                  {!isCourseOwner && !isEnrolled && (
                    <button 
                      onClick={() => {
                        if (!user) {
                          toast.error("Please log in or sign up to enroll!");
                          navigate('/login');
                        } else {
                          setShowCheckout(true);
                        }
                      }} 
                      style={{ padding: '1rem 2.5rem', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '0.5rem', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 15px rgba(79, 70, 229, 0.4)', transition: 'transform 0.2s' }} 
                      onMouseOver={(e)=>e.currentTarget.style.transform='scale(1.05)'} 
                      onMouseOut={(e)=>e.currentTarget.style.transform='scale(1)'}
                    >
                      Enroll Now
                    </button>
                  )}

                  {isEnrolled && (
                    <span style={{ padding: '1rem 2rem', background: '#10b981', color: 'white', borderRadius: '0.5rem', fontSize: '1.1rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <CheckCircle size={22} /> Enrolled
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Right Thumbnail */}
            <div style={{ flex: '1 1 400px', display: 'flex', justifyContent: 'center' }}>
              <img src={course.thumbnail} alt={course.title} style={{ width: '100%', maxWidth: '450px', height: 'auto', objectFit: 'cover', borderRadius: '1rem', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.5)' }} />
            </div>
          </div>
        </div>
      </div>
      
      {/* 🟢 MAIN CONTENT AREA */}
      <div style={{ width: '100%', maxWidth: '1100px', margin: '0 auto', padding: '3rem 5%' }}>

        {/* 📊 PROGRESS BAR & CERTIFICATE SECTION */}
        {isEnrolled && lessons.length > 0 && (
          <div style={{ marginBottom: '3rem', background: '#ffffff', padding: '2rem', borderRadius: '1rem', boxShadow: '0 4px 6px rgba(0,0,0,0.02)', border: progressPercentage === 100 ? '2px solid #10b981' : '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', alignItems: 'center' }}>
              <span style={{ fontWeight: '700', fontSize: '1.1rem', color: '#1e293b' }}>Your Course Progress</span>
              <span style={{ fontWeight: '800', fontSize: '1.2rem', color: progressPercentage === 100 ? '#10b981' : '#4f46e5' }}>
                {progressPercentage}% {progressPercentage === 100 && '🎉'}
              </span>
            </div>
            
            <div style={{ width: '100%', height: '12px', background: '#f1f5f9', borderRadius: '10px', overflow: 'hidden' }}>
              <div style={{ width: `${progressPercentage}%`, height: '100%', background: progressPercentage === 100 ? '#10b981' : 'linear-gradient(90deg, #4f46e5, #818cf8)', transition: 'width 0.8s ease-in-out' }}></div>
            </div>

            {/* DOWNLOAD CERTIFICATE BUTTON */}
            {progressPercentage === 100 && (
              <div style={{ marginTop: '2rem', textAlign: 'center', background: '#ecfdf5', padding: '1.5rem', borderRadius: '0.5rem', border: '1px dashed #34d399' }}>
                <h3 style={{ color: '#065f46', margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  <Award size={28} /> Congratulations on completing the course!
                </h3>
                <button onClick={downloadCertificate} disabled={downloadingCert} style={{ background: '#10b981', color: 'white', padding: '1rem 2.5rem', border: 'none', borderRadius: '50px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0 auto', boxShadow: '0 4px 10px rgba(16, 185, 129, 0.3)', transition: 'transform 0.2s' }} onMouseOver={(e)=>e.currentTarget.style.transform='scale(1.05)'} onMouseOut={(e)=>e.currentTarget.style.transform='scale(1)'}>
                  {downloadingCert ? <><Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }}/> Generating PDF...</> : '🎓 Download My Certificate'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* 📚 LESSONS LIST */}
        <div style={{ marginBottom: '4rem' }}>
          <h2 style={{ marginBottom: '1.5rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <PlayCircle size={28} color="#4f46e5" /> Course Curriculum ({lessons.length} Lessons)
          </h2>
          
          {lessons.length === 0 ? (
            <p style={{ color: '#64748b', fontStyle: 'italic', background: '#ffffff', padding: '2rem', borderRadius: '1rem', border: '1px solid #e2e8f0', textAlign: 'center' }}>No lessons have been added to this course yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {lessons.map((lesson, index) => {
                const isCompleted = completedLessons.includes(lesson._id);
                const hasAccess = isEnrolled || isCourseOwner;

                return (
                  <div key={lesson._id} style={{ 
                    padding: '1.5rem', 
                    border: isCompleted ? '1px solid #10b981' : hasAccess ? '1px solid #e2e8f0' : '1px solid #cbd5e1', 
                    borderRadius: '1rem', 
                    background: isCompleted ? '#ecfdf5' : hasAccess ? '#ffffff' : '#f8fafc',
                    boxShadow: hasAccess ? '0 4px 6px rgba(0,0,0,0.02)' : 'none',
                    transition: 'all 0.3s' 
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                      <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.8rem', color: isCompleted ? '#059669' : hasAccess ? '#0f172a' : '#64748b' }}>
                        {!hasAccess ? <Lock size={22} color="#94a3b8" /> : isCompleted ? <CheckCircle size={24} /> : <PlayCircle size={24} color="#4f46e5" />} 
                        {index + 1}. {lesson.title}
                      </h3>
                      
                      {isEnrolled && !isCompleted && (
                        <button onClick={() => markAsComplete(lesson._id)} style={{ padding: '0.5rem 1.2rem', background: 'transparent', color: '#4f46e5', border: '1px solid #4f46e5', borderRadius: '50px', fontSize: '0.9rem', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={(e)=>{e.currentTarget.style.background='#4f46e5'; e.currentTarget.style.color='white';}} onMouseOut={(e)=>{e.currentTarget.style.background='transparent'; e.currentTarget.style.color='#4f46e5';}}>
                          Mark as Complete
                        </button>
                      )}
                      {isEnrolled && isCompleted && (
                        <span style={{ color: '#10b981', fontWeight: '700', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <CheckCircle size={16} /> Completed
                        </span>
                      )}
                    </div>

                    {hasAccess ? (
                      <div style={{ marginTop: '1.5rem' }}>
                        <video controls controlsList="nodownload" style={{ width: '100%', borderRadius: '0.5rem', background: '#0f172a', maxHeight: '450px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
                          <source src={lesson.videoUrl} type="video/mp4" />
                        </video>
                        {lesson.pdfUrl && (
                          <a href={lesson.pdfUrl} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem', padding: '0.6rem 1.2rem', background: '#f1f5f9', color: '#334155', borderRadius: '0.5rem', textDecoration: 'none', fontWeight: '600', transition: 'background 0.2s' }} onMouseOver={(e)=>e.currentTarget.style.background='#e2e8f0'} onMouseOut={(e)=>e.currentTarget.style.background='#f1f5f9'}>
                            <FileText size={18} color="#4f46e5"/> Download Class Notes (PDF)
                          </a>
                        )}
                      </div>
                    ) : (
                      <div style={{ marginTop: '1rem', padding: '1rem', background: '#f1f5f9', borderRadius: '0.5rem', color: '#64748b', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Lock size={16} /> Enroll in this course to unlock this video and study materials.
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
        
        {/* 💬 LIVE Q&A FORUM / SOCKET.IO CHAT */}
        {(isEnrolled || isCourseOwner) && (
          <CourseDiscussion courseId={id} user={user} />
        )}

        {/* 👨‍🏫 INSTRUCTOR / ADMIN: ADD LESSON DASHBOARD WIDGET */}
        {isCourseOwner && (
          <div style={{ marginTop: '4rem', padding: '2.5rem', background: '#ffffff', borderRadius: '1rem', border: '1px solid #e2e8f0', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)' }}>
            <h2 style={{ marginBottom: '2rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <PlusCircle size={28} color="#10b981" /> Add New Video Lesson
            </h2>
            <form onSubmit={handleAddLesson} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#334155' }}>Lesson Title</label>
                <input type="text" placeholder="e.g. Introduction to React Props" style={{ width: '100%', padding: '1rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', background: '#f8fafc', fontSize: '1rem' }} value={lessonTitle} onChange={(e) => setLessonTitle(e.target.value)} required />
              </div>
              
              <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                <div style={{ flex: '1 1 300px' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#334155' }}>Lecture Video (MP4)</label>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '1rem', border: '1px dashed #94a3b8', borderRadius: '0.5rem', background: '#f8fafc' }}>
                    <input type="file" id="video-upload" style={{ display: 'none' }} accept="video/mp4,video/x-m4v,video/*" onChange={(e) => handleLessonUpload(e, 'video')} />
                    <label htmlFor="video-upload" style={{ padding: '0.6rem 1.2rem', background: '#4f46e5', color: 'white', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {uploadingVideo ? <Loader2 size={18} style={{animation: 'spin 1s linear infinite'}}/> : <PlayCircle size={18}/>} 
                      {uploadingVideo ? 'Uploading...' : 'Upload Video'}
                    </label>
                    {videoUrl && <span style={{ color: '#10b981', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.3rem' }}><CheckCircle size={18}/> Ready</span>}
                  </div>
                </div>

                <div style={{ flex: '1 1 300px' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#334155' }}>Study Material (PDF) <span style={{color: '#94a3b8', fontWeight: 'normal'}}>- Optional</span></label>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '1rem', border: '1px dashed #94a3b8', borderRadius: '0.5rem', background: '#f8fafc' }}>
                    <input type="file" id="pdf-upload" style={{ display: 'none' }} accept="application/pdf" onChange={(e) => handleLessonUpload(e, 'pdf')} />
                    <label htmlFor="pdf-upload" style={{ padding: '0.6rem 1.2rem', background: '#ffffff', color: '#4f46e5', border: '1px solid #4f46e5', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {uploadingPdf ? <Loader2 size={18} style={{animation: 'spin 1s linear infinite'}}/> : <FileText size={18}/>} 
                      {uploadingPdf ? 'Uploading...' : 'Upload Notes'}
                    </label>
                    {pdfUrl && <span style={{ color: '#10b981', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.3rem' }}><CheckCircle size={18}/> Ready</span>}
                  </div>
                </div>
              </div>

              <button type="submit" disabled={addingLesson || uploadingVideo || uploadingPdf} style={{ width: '100%', marginTop: '1rem', padding: '1.2rem', background: '#10b981', color: 'white', border: 'none', borderRadius: '0.5rem', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 6px rgba(16, 185, 129, 0.2)', transition: 'background 0.2s', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
                {addingLesson ? <><Loader2 size={22} style={{animation: 'spin 1s linear infinite'}}/> Publishing Lesson...</> : 'Publish Video Lesson'}
              </button>
            </form>
          </div>
        )}
      </div>

      {/* 💳 OPTIMIZED CINEMATIC PAYMENT GATEWAY MODAL */}
      {showCheckout && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem' }}>
          <div style={{ background: '#ffffff', borderRadius: '1.25rem', width: '100%', maxWidth: '380px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', animation: 'slideUp 0.3s ease-out' }}>
            
            {/* Header */}
            <div style={{ background: '#f8fafc', padding: '1.25rem 1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <CreditCard size={24} color="#4f46e5" />
              <div>
                <h3 style={{ margin: 0, color: '#0f172a', fontSize: '1.1rem' }}>Secure Enrollment</h3>
                <p style={{ margin: 0, color: '#64748b', fontSize: '0.8rem' }}>Test Environment</p>
              </div>
            </div>
            
            {/* Body */}
            <div style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px dashed #cbd5e1', paddingBottom: '1rem' }}>
                <div style={{ flex: 1, paddingRight: '1rem' }}>
                  <span style={{ color: '#64748b', fontSize: '0.8rem', display: 'block' }}>Course</span>
                  <span style={{ fontWeight: '600', color: '#1e293b', fontSize: '0.9rem', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{course.title}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ color: '#64748b', fontSize: '0.8rem', display: 'block' }}>Total</span>
                  <span style={{ fontWeight: '800', fontSize: '1.2rem', color: '#4f46e5' }}>₹{course.price}</span>
                </div>
              </div>
              
              <form onSubmit={handlePaymentSubmit}>
                <div style={{ marginBottom: '1.2rem' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#475569', marginBottom: '0.4rem', fontWeight: '600' }}>Cardholder Name</label>
                  <input type="text" value={checkoutData.name} onChange={(e) => setCheckoutData({...checkoutData, name: e.target.value})} required style={{ width: '100%', padding: '0.7rem 1rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', background: '#f8fafc', fontSize: '0.9rem', outline: 'none' }} onFocus={(e)=>e.target.style.borderColor='#4f46e5'} onBlur={(e)=>e.target.style.borderColor='#cbd5e1'} />
                </div>
                
                <div style={{ marginBottom: '1.2rem' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#475569', marginBottom: '0.4rem', fontWeight: '600' }}>Card Number (Dummy)</label>
                  <input type="text" placeholder="0000 0000 0000 0000" maxLength="16" value={checkoutData.cardNumber} onChange={(e) => setCheckoutData({...checkoutData, cardNumber: e.target.value})} required style={{ width: '100%', padding: '0.7rem 1rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', background: '#f8fafc', outline: 'none', letterSpacing: '1.5px', fontFamily: 'monospace', fontSize: '1rem' }} onFocus={(e)=>e.target.style.borderColor='#4f46e5'} onBlur={(e)=>e.target.style.borderColor='#cbd5e1'} />
                </div>
                
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#475569', marginBottom: '0.4rem', fontWeight: '600' }}>Expiry</label>
                    <input type="text" placeholder="MM/YY" maxLength="5" required style={{ width: '100%', padding: '0.7rem 1rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', background: '#f8fafc', fontSize: '0.9rem', outline: 'none' }} onFocus={(e)=>e.target.style.borderColor='#4f46e5'} onBlur={(e)=>e.target.style.borderColor='#cbd5e1'} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#475569', marginBottom: '0.4rem', fontWeight: '600' }}>CVV</label>
                    <input type="password" placeholder="***" maxLength="3" required style={{ width: '100%', padding: '0.7rem 1rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', background: '#f8fafc', fontSize: '0.9rem', outline: 'none' }} onFocus={(e)=>e.target.style.borderColor='#4f46e5'} onBlur={(e)=>e.target.style.borderColor='#cbd5e1'} />
                  </div>
                </div>
                
                <button type="submit" disabled={processingPayment} style={{ width: '100%', padding: '0.8rem', background: '#0f172a', color: 'white', border: 'none', borderRadius: '0.5rem', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', transition: 'background 0.2s' }} onMouseOver={(e)=>e.currentTarget.style.background='#1e293b'} onMouseOut={(e)=>e.currentTarget.style.background='#0f172a'}>
                  {processingPayment ? <><Loader2 size={18} style={{animation: 'spin 1s linear infinite'}}/> Processing...</> : <><Lock size={16}/> Pay ₹{course.price}</>}
                </button>
                <button type="button" onClick={() => setShowCheckout(false)} disabled={processingPayment} style={{ width: '100%', marginTop: '0.5rem', padding: '0.8rem', background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem', transition: 'color 0.2s' }} onMouseOver={(e)=>e.currentTarget.style.color='#0f172a'} onMouseOut={(e)=>e.currentTarget.style.color='#64748b'}>
                  Cancel
                </button>
              </form>
            </div>
            <style>{`@keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }`}</style>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseDetails;