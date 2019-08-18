import React, { useState, useEffect, FC } from 'react'
import UserPicture from './User/UserPicture'
import Crowi from 'client/util/Crowi'
import { Container, Row, Col } from 'reactstrap'
import ReactMarkdown from 'react-markdown'
import { Page as PageType } from 'client/types/crowi'

interface Props {
  crowi: Crowi
  pageId: string | null
}

function usePage(crowi: Crowi) {}

const Editor: FC<Props> = ({ crowi, pageId }) => {
  const [page, setPage] = useState()

  useEffect(() => {
    const fetchPage = async pageId => {
      try {
        const res = await crowi.apiGet('/pages.get', { page_id: pageId })
        console.log(res)
        if (res.ok) {
          console.log(res.page)
          setPage(res.page)
        }
      } catch (e) {
        console.log('Error', e)
      }
    }

    if (!page) {
      fetchPage(pageId)
    }
  })

  if (!page) {
    return <span>...</span>
  }

  return (
    <Row>
      <Col md="6">{page.revision.body}</Col>
      <Col md="6">
        <ReactMarkdown source={page.revision.body} className="wiki" />
      </Col>
    </Row>
  )
}

export default Editor
