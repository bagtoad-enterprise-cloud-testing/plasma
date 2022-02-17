import {
    generateChangelog,
    getLastTag,
    getNextVersion,
    getCommits,
    getCurrentVersion,
    getRemoteName,
    gitPush,
    gitPushTags,
    gitTag,
    gitCommit,
    parseCommits,
    pnpmBumpVersion,
    pnpmGetChangedPackages,
    pnpmPublish,
    writeChangelog,
} from '@coveo/semantic-monorepo-tools';
import { Command, Option } from 'commander';
import angularChangelogConvention from 'conventional-changelog-angular';

const VERSION_PREFIX = 'v';
const PATH = '.';
const BUMP_TYPES = ['major', 'minor', 'patch', 'prerelease']

const program = new Command();
program
    .option('--dry', 'dry run', false)
    .option('--tag', 'tag to use on NPM', 'latest')
    .option('--branch', 'allow deploy on branch', 'master')
    .option('--force <packages...>', 'force a bump on specified package', ['root'])
    .addOption(new Option('--bump <type>', 'bump a <type> version instead of reliying on commit messages').choices(BUMP_TYPES))

program.parse();

const options = program.opts();

// We consider that root always changes, we always want to bump a version
if (!options.force.includes('root')){
    options.force.push('root');
}

(async () => {
    const convention = await angularChangelogConvention;

    const lastTag = getLastTag(VERSION_PREFIX);
    console.log('Last tag: %s', lastTag);

    const remote = getRemoteName();
    const since = lastTag;

    console.log('Since: %s', since);

    const changedPackages = pnpmGetChangedPackages(since);
    options.force.forEach(packageName => {
        if (!changedPackages.includes(packageName)) {
            changedPackages.push(packageName);
        }
    });

    if (changedPackages.length > 0) {
        const commits = getCommits(PATH, lastTag);

        const parsedCommits = parseCommits(commits, convention.parserOpts);
        let bumpInfo;
        if (options.bump !== null && BUMP_TYPES.includes(options.bump)) {
            bumpInfo = {type: options.bump, preid: options.bump === 'prerelease' ? 'next' : undefined};
        } else {
            bumpInfo = convention.recommendedBumpOpts.whatBump(parsedCommits);
        }

        const currentVersion = getCurrentVersion(PATH);
        const newVersion = getNextVersion(currentVersion, bumpInfo);

        if (newVersion !== currentVersion) {
            console.log('Bumping %s to version %s', changedPackages.join(', '), newVersion)
            pnpmBumpVersion(newVersion, since, options.force);

            if (parsedCommits.length > 0) {
                const changelog = await generateChangelog(
                    parsedCommits,
                    newVersion,
                    {
                        host: 'https://github.com',
                        owner: 'coveo',
                        repository: 'plasma',
                    },
                    convention.writerOpts
                );
                await writeChangelog(PATH, changelog);
            }

            const versionTag = `${VERSION_PREFIX}${newVersion}`;
            if (!options.dry) {
                gitCommit(`chore(release): publish version ${versionTag} [version bump]`, '.');
                gitTag(versionTag);
                if (remote) {
                    gitPush();
                    gitPushTags();

                    const forcePackagesWithoutRoot = options.force.filter(packageName => packageName !== 'root');
                    pnpmPublish(since, options.tag, options.branch, forcePackagesWithoutRoot, ['root']);
                }
            }
        }
    } else {
        console.log('No package changed, skipping publish');
    }
})();