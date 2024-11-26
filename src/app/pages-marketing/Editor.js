import React, { Component, useCallback  } from 'react';
import Post from './Post';

import {
  Upload,
  Divider,
  Input,
  Select,
  TimePicker,
  Button,
  InputNumber,
  Checkbox
} from 'antd';

import {PlusCircleFilled, UserOutlined, UploadOutlined} from '@ant-design/icons'; 



import './Editor.css';

const { Option } = Select;

class Editor extends Component {
  constructor(props) {
    super(props);
    console.log("estos son los props");
    console.log(props);

    // this.state = {
    //   avtars: [],
    //   images: [],
    //   includeLike: false,
    //   includeLove: false,
    //   includeHaha: false,
    //   includeWow: false,
    //   includeSad: false,
    //   includeAngry: false,
    //   editorShown: true,
    // };
  }

  toggleEditor = () => {
    //let { editorShown } = this.state;
    //this.setState({ editorShown: !editorShown });
    this.props.setEditorShown(!this.props.editorShown);
  };

  //uploadAvtar = ({ fileList }) => this.setState({ avtars: fileList });

  setTime = (time, timeString) => {
    this.props.setTime(timeString);
    //this.setState({ time: timeString });
  };

  setPrivacy = value => {
    //this.setState({ privacy: value });
    this.props.setPrivacy(value);
  };

   uploadImages = ({ fileList }) => {
     const images = fileList.map(file => {
       return file.thumbUrl;
     });
     this.props.setImagesList(fileList);
     this.props.setImages(images);
     console.log("File list");
     console.log(fileList);
     console.log("imagenes");
     console.log(images);
   };

//   uploadImages = useCallback((info) => {
//     if (info.file.status === 'uploading') {
//         //setImage({ loading: true, image: null });
//         info.file.status = 'done';
//     }
//     if (info.file.status === 'done') {
//         getBase64(info.file.originFileObj, (imageUrl) => {
//             const img = new Image();
//             img.src = imageUrl;
//             img.addEventListener('load', function () {
//                 //setImage({ loading: false, image: imageUrl });
//                 this.props.setImages([{ ...info.fileList[0] }]);
//             });
//         });
//     }
// }, []);

  includeLike = () => {
    //let { includeLike } = this.state;
    //this.setState({ includeLike: !includeLike });
    this.props.setIncludeLike(!this.props.includeLike);
  };

  includeLove = () => {
    //let { includeLove } = this.state;
    //this.setState({ includeLove: !includeLove });

    this.props.setIncludeLove(!this.props.includeLove);
  };

  includeHaha = () => {
    //let { includeHaha } = this.state;
    //this.setState({ includeHaha: !includeHaha });

    this.props.setIncludeHaha(!this.props.includeHaha);
  };

  includeWow = () => {
    //let { includeWow } = this.state;
    //this.setState({ includeWow: !includeWow });

    this.props.setIncludeWow(!this.props.includeWow);
  };

  includeSad = () => {
    //let { includeSad } = this.state;
    //this.setState({ includeSad: !includeSad });

    this.props.setIncludeSad(!this.props.includeSad);
  };

  includeAngry = () => {
    //let { includeAngry } = this.state;
    //this.setState({ includeAngry: !includeAngry });

    this.props.setIncludeAngry(!this.props.includeAngry);
  };

  render() {
    // const {
    //   avtars,
    //   name,
    //   caption,
    //   time,
    //   privacy,
    //   likes,
    //   images,
    //   editorShown,
    // } = this.state;
    // let {
    //   includeLike,
    //   includeLove,
    //   includeHaha,
    //   includeWow,
    //   includeSad,
    //   includeAngry,
    // } = this.state;

    // const uploadButton = (
    //   <div>
    //     <PlusCircleFilled />
    //     <div className="ant-upload-text">Upload Avtar</div>
    //   </div>
    // );

    return (
      <div className="App border">
        <Button onClick={this.toggleEditor} className="editor-hide-button">
          {this.props.editorShown ? 'Hide Editor' : 'Show Editor'}
        </Button>

        {this.props.editorShown && (
          <div className="editor">
            {/* <div className="editor_avtar">
              <Upload
                action="//jsonplaceholder.typicode.com/posts/"
                listType="picture-card"
                onPreview={() => {}}
                accept="image/*"
                onChange={this.uploadAvtar}
              >
                {avtars.length >= 1 ? null : uploadButton}
              </Upload>
            </div> */}

            {/* <div className="editor_name">
              <Input
                placeholder="Your Name"
                prefix={
                  <UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />
                }
                onChange={e => this.props.setName(e.target.value)}
              />
            </div> */}

            {/* <div className="editor_time_privacy">
              {/* <TimePicker
                onChange={this.setTime}
                use12Hours
                format="h:mm a"
                className="select-time"
                placeholder="Select Time"
              /> 

               <Select
                defaultValue=""
                className="editor-privacy"
                onChange={this.setPrivacy}
              >
                <Option value="" disabled>
                  Privacy
                </Option>
                <Option value="public">Public</Option>
                <Option value="friends">Friends</Option>
              </Select> 
            </div> */}

            <div className="editor_caption">
              <Input.TextArea
                rows={1}
                placeholder="Ingrese el texto de la publicación"
                value={this.props.caption}
                onChange={e => this.props.setCaption(e.target.value)}
              />
            </div>

            <Divider />

            <p>
              <b>Subir imágenes:</b> 
            </p>
            <Upload
              action="//jsonplaceholder.typicode.com/posts/"
              listType="picture"
              multiple
              onPreview={() => {}}
              accept="image/*"
              onChange={this.uploadImages}
              beforeUpload={() => {
                return false;
              }}
              defaultFileList={this.props.imagesList}
            >
              <Button>
                <UploadOutlined /> Subir imágenes
              </Button>
            </Upload>

            {/* <Divider />

            <InputNumber
              style={{ width: '100%' }}
              placeholder="Initial Likes"
              onChange={value => this.setState({ likes: value })}
            />

            <br />
            <br />
            <b>Includes:</b>
            <br />
            <Checkbox
              onChange={this.includeLike}
              style={{ width: 'calc(33% - 10px)', marginLeft: 10 }}
            >
              Likes
            </Checkbox>
            <Checkbox
              onChange={this.includeLove}
              style={{ width: 'calc(33% - 10px)', marginLeft: 10 }}
            >
              Love
            </Checkbox>
            <Checkbox
              onChange={this.includeHaha}
              style={{ width: 'calc(33% - 10px)', marginLeft: 10 }}
            >
              Haha
            </Checkbox>
            <Checkbox
              onChange={this.includeWow}
              style={{ width: 'calc(33% - 10px)', marginLeft: 10 }}
            >
              WoW
            </Checkbox>
            <Checkbox
              onChange={this.includeSad}
              style={{ width: 'calc(33% - 10px)', marginLeft: 10 }}
            >
              Sad
            </Checkbox>
            <Checkbox
              onChange={this.includeAngry}
              style={{ width: 'calc(33% - 10px)', marginLeft: 10 }}
            >
              Angry
            </Checkbox> */}
          </div>
        )}

        <div className="result">
          <Post
            avtar={this.props.avtars[0] ? this.props.avtars[0].thumbUrl : false}
            name={this.props.usuarioRedSocial}
            time={this.props.horaPublicacionRedSocial != null? this.props.fechaPublicacionRedSocialString != ""? this.props.fechaPublicacionRedSocialString + " a las " + this.props.horaPublicacionRedSocial:  this.props.horaPublicacionRedSocial: this.props.fechaPublicacionRedSocialString}
            privacy={"public"}
            caption={this.props.caption}
            images={this.props.images}
            likes={this.props.likes}
            includeLike={this.props.includeLike}
            includeLove={this.props.includeLove}
            includeHaha={this.props.includeHaha}
            includeWow={this.props.includeWow}
            includeSad={this.props.includeSad}
            includeAngry={this.props.includeAngry}
          />
        </div>
        <div style={{ height: 200, width: '100%' }}>&nbsp;</div>
      </div>
    );
  }
}

export default Editor;