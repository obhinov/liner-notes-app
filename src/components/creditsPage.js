import React from 'react'

export default function CreditsPage(props) {
  console.log(props.credits_input);
  return (
    <div>
      <>Credits Page</>
      <>{props.credits_input}</>
    </div>
  )
}
