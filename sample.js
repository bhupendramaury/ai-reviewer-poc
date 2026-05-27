async function postComments(octokit, comments, payload) {
  const { pull_request, repository } = payload;
  
  for (const comment of comments) {
    if (comment.severity === 'low' && comments.length > 10) continue; // reduce noise
    
    const body = formatComment(comment);
    
    try {
      await octokit.pulls.createReviewComment({
        owner: repository.owner.login,
        repo: repository.name,
        pull_number: pull_request.number,
        commit_id: pull_request.head.sha,
        path: comment.file,
        line: comment.line,
        body,
      });
    } catch (e) {
      console.error(`Failed to post comment on ${comment.file}:${comment.line}`, e.message);
    }
  }
}

function formatComment(comment) {
  const badge = { high: '🔴', medium: '🟡', low: '🔵' }[comment.severity];
  const passLabel = { 
    security: '🔒 Security', performance: '⚡ Performance', 
    test_coverage: '🧪 Test coverage', architecture: '🏗️ Architecture' 
  }[comment.pass];

  let body = `${badge} **${passLabel}** — ${comment.issue}\n\n${comment.suggestion}`;
  
  // GitHub Suggestion block — one-click apply
  if (comment.fix_code) {
    body += `\n\n\`\`\`suggestion\n${comment.fix_code}\n\`\`\``;
  }
  
  return body;
}
