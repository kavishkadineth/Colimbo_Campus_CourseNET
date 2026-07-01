import fs from 'fs';
import axios from 'axios';
import FormData from 'form-data';

const form = new FormData();
form.append('organization_id', '6');
form.append('course_name', 'Test Course with Photo');
form.append('flyer', fs.createReadStream('/tmp/test.jpg'));

axios.post('http://127.0.0.1:8000/api/courses', form, {
  headers: form.getHeaders()
}).then(res => console.log(res.data)).catch(err => console.error(err.response?.data || err.message));
