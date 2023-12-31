import { useState } from 'react'

import { IVideoInfo } from '../App'
import { api } from '../lib/axios'
import {
  Container,
  Content,
  List,
  Trigger,
  Table,
  Button,
} from '../styles/components/tab'

import { toast } from 'react-toastify'

interface TabProps {
  info: IVideoInfo
}

type TypeQuality = Record<number, string>

const MP4Quality: TypeQuality = {
  137: '1080p',
  136: '720p',
  135: '480p',
  18: '360p',
  160: '144p',
}

const MP3Bitrate: TypeQuality = {
  320: '320kbps',
  256: '256kbps',
  192: '192kbps',
  128: '128kbps',
  64: '64kbps',
}

export function Tab({ info }: TabProps) {
  const [inDownload, setInDownload] = useState<boolean>(false)

  async function handlerDownloadAudio(id: string, bitrate: number) {
    setInDownload(true)
    toast.info('♻️ Conversion Started! Please wait.', {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: false,
      theme: 'dark',
    })
    try {
      const response = await api.get(`/downloadAudio/${id}`, {
        responseType: 'blob',
        params: {
          bitrate,
        },
      })

      const blob = new Blob([response.data], { type: 'audio/mp3' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute(
        'download',
        `ytgrab - ${info.title} (${MP3Bitrate[bitrate]}).mp3`,
      )
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      toast.success('✅ Conversion completed!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        theme: 'dark',
      })
    } catch (error: any) {
      if (error?.response?.status === 413) {
        toast.error('❌ Video longer than 10 minutes!', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: false,
          theme: 'dark',
        })
      } else {
        toast.error('❌ Error when downloading!', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: false,
          theme: 'dark',
        })
      }
    }

    setInDownload(false)
  }

  async function handlerDownload(id: string, quality: number) {
    setInDownload(true)
    toast.info('♻️ Conversion Started! Please wait.', {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: false,
      theme: 'dark',
    })
    try {
      const response = await api.get(`/download/${id}`, {
        responseType: 'blob',
        params: {
          quality,
        },
      })

      const blob = new Blob([response.data], { type: 'video/mp4' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute(
        'download',
        `ytgrab - ${info.title} (${MP4Quality[quality]}).mp4`,
      )
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      toast.success('✅ Conversion completed!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        theme: 'dark',
      })
    } catch (error: any) {
      if (error?.response?.status === 413) {
        toast.error('❌ Video longer than 10 minutes!', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: false,
          theme: 'dark',
        })
      } else {
        toast.error('❌ Error when downloading!', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: false,
          theme: 'dark',
        })
      }
    }

    setInDownload(false)
  }

  return (
    <Container defaultValue="MP4" orientation="vertical">
      <List aria-label="Download a video in MP4 or MP3">
        <Trigger value="MP4">MP4</Trigger>
        <Trigger value="MP3">MP3</Trigger>
      </List>
      <Content value="MP4">
        <Table>
          <thead>
            <tr>
              <td>Resolution</td>
              <td>Size (Approx)</td>
              <td>Download</td>
            </tr>
          </thead>
          <tbody>
            {info.mp4Qualities.map((quality) => (
              <tr key={quality.itag}>
                <td>MP4 {quality.quality}</td>
                <td>
                  {quality.fileSize ? quality.fileSize?.toFixed(2) : '0.00'}MB
                </td>
                <td>
                  <Button
                    disabled={inDownload}
                    onClick={() => handlerDownload(info.id, quality.itag)}
                  >
                    DOWNLOAD
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Content>
      <Content value="MP3">
        <Table>
          <thead>
            <tr>
              <td>Resolution</td>
              <td>Size (Approx)</td>
              <td>Download</td>
            </tr>
          </thead>
          <tbody>
            {info.mp3Qualities.map((quality) => (
              <tr key={quality.itag}>
                <td>MP3 {quality.quality}</td>
                <td>
                  {quality.fileSize ? quality.fileSize?.toFixed(2) : '0.00'}MB
                </td>
                <td>
                  <Button
                    disabled={inDownload}
                    onClick={() => handlerDownloadAudio(info.id, quality.itag)}
                  >
                    DOWNLOAD
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Content>
    </Container>
  )
}
